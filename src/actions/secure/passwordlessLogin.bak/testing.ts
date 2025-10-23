"use server";

import { admin, db } from "@/lib/firebase";
import { 
  DeviceInfo, 
  initiateLoginRequest, 
  updateLoginRequestStatus,
  notifyDevice
} from "./index";

/**
 * Register a new test device for passwordless login
 * Used for testing and development only
 */
export async function registerTestDevice(
  deviceName: string,
  deviceOs: "android" | "ios" | "web" | "unknown" = "web"
): Promise<DeviceInfo | null> {
  try {
    // Generate a fake FCM token for test purposes
    const fcmToken = `test-${Math.random().toString(36).substring(2, 15)}`;
    
    // Create device document
    const deviceRef = await db.collection("client-apps").add({
      deviceName,
      deviceOs,
      fcmToken,
      lastActive: new Date(),
      isTestDevice: true,
      createdAt: new Date()
    });
    
    return {
      id: deviceRef.id,
      fcmToken,
      deviceName,
      deviceOs
    };
  } catch (error) {
    console.error("Error registering test device:", error);
    return null;
  }
}

/**
 * Simulate login request approval from a device
 * Used for testing and development only
 */
export async function simulateDeviceApproval(
  requestId: string,
  deviceId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Create a mock JWT token
    // In a real scenario, this would be signed by the device's private key
    const mockJwt = Buffer.from(
      JSON.stringify({
        header: { alg: "HS256", typ: "JWT" },
        payload: { 
          deviceId,
          requestId,
          timestamp: Date.now()
        }
      })
    ).toString("base64");
    
    // Update the login request status
    return await updateLoginRequestStatus(requestId, "approved", mockJwt);
  } catch (error) {
    console.error("Error simulating device approval:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Mock function to simulate a notification being received by a device
 */
export async function mockNotificationReceived(
  deviceId: string,
  type: string,
  data: Record<string, string> = {}
): Promise<boolean> {
  try {
    // Log the notification receipt
    await db.collection("notification-logs").add({
      deviceId,
      type,
      data,
      receivedAt: new Date(),
      isMock: true
    });
    
    // For login requests, automatically approve after a delay
    if (type === "login_request" && data.requestId) {
      // Wait 2 seconds to simulate user interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await simulateDeviceApproval(data.requestId, deviceId);
      return result.success;
    }
    
    return true;
  } catch (error) {
    console.error("Error mocking notification received:", error);
    return false;
  }
}

/**
 * Clean up test devices and data
 */
export async function cleanupTestDevices(): Promise<{ removed: number }> {
  try {
    const testDevices = await db.collection("client-apps")
      .where("isTestDevice", "==", true)
      .get();
    
    if (testDevices.empty) {
      return { removed: 0 };
    }
    
    const batch = db.batch();
    let count = 0;
    
    testDevices.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });
    
    await batch.commit();
    
    return { removed: count };
  } catch (error) {
    console.error("Error cleaning up test devices:", error);
    return { removed: 0 };
  }
}
