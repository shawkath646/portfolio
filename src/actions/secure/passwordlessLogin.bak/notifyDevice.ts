"use server";

import { admin, db } from "@/lib/firebase";
import { cache } from "react";
import { 
  DeviceInfo, 
  NotificationType, 
  NotificationOptions, 
  NotificationResult, 
  BatchNotificationResult 
} from "./types";

// In-memory cache for device FCM tokens
const fcmTokenCache = new Map<string, { token: string; timestamp: number }>();
const FCM_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Get device FCM token with caching
 */
export const getDeviceFcmToken = cache(async (deviceId: string): Promise<string | null> => {
  try {
    // Check memory cache first
    const now = Date.now();
    const cached = fcmTokenCache.get(deviceId);
    
    if (cached && (now - cached.timestamp) < FCM_CACHE_EXPIRY) {
      return cached.token;
    }
    
    // Fetch from database
    const deviceDoc = await db.collection("client-apps").doc(deviceId).get();
    if (!deviceDoc.exists) {
      console.error(`Device not found: ${deviceId}`);
      return null;
    }
    
    const { fcmToken } = deviceDoc.data() as { fcmToken: string };
    
    // Update cache
    fcmTokenCache.set(deviceId, { token: fcmToken, timestamp: now });
    
    return fcmToken;
  } catch (error) {
    console.error("Error fetching device FCM token:", error);
    return null;
  }
});

/**
 * Clean up expired tokens from memory cache
 */
const cleanupTokenCache = () => {
  const now = Date.now();
  
  for (const [deviceId, data] of fcmTokenCache.entries()) {
    if ((now - data.timestamp) > FCM_CACHE_EXPIRY) {
      fcmTokenCache.delete(deviceId);
    }
  }
};

/**
 * Get full device info (token + metadata)
 */
export const getDeviceInfo = cache(async (deviceId: string): Promise<DeviceInfo | null> => {
  try {
    const deviceDoc = await db.collection("client-apps").doc(deviceId).get();
    if (!deviceDoc.exists) {
      return null;
    }
    
    const data = deviceDoc.data() as Omit<DeviceInfo, "id">;
    
    return {
      ...data,
      id: deviceId
    };
  } catch (error) {
    console.error("Error fetching device info:", error);
    return null;
  }
});

/**
 * Send a notification to a device
 */
export async function notifyDevice(options: NotificationOptions): Promise<NotificationResult> {
  try {
    // Clean up expired tokens periodically
    cleanupTokenCache();
    
    // Get FCM token if only deviceId is provided
    let fcmToken = options.fcmToken;
    if (!fcmToken && options.deviceId) {
      const token = await getDeviceFcmToken(options.deviceId);
      if (!token) {
        return {
          success: false,
          message: "Device FCM token not found"
        };
      }
      fcmToken = token;
    }
    
    if (!fcmToken) {
      return {
        success: false,
        message: "No FCM token or device ID provided"
      };
    }
    
    // Prepare notification data
    const baseData = {
      type: options.type,
      timestamp: Date.now().toString(),
      ...(options.data || {})
    };
    
    // Prepare message payload
    const message: admin.messaging.Message = {
      token: fcmToken,
      data: baseData,
      
      // Configure platform specific options
      android: options.title || options.body ? {
        priority: options.priority || "high",
        notification: {
          title: options.title,
          body: options.body,
          icon: options.icon,
          color: options.color,
          clickAction: options.clickAction
        },
        ttl: options.timeToLive ? options.timeToLive * 1000 : undefined
      } : undefined,
      
      apns: options.title || options.body ? {
        payload: {
          aps: {
            alert: {
              title: options.title,
              body: options.body
            },
            badge: options.badge,
            sound: options.sound || "default",
            "content-available": options.contentAvailable ? 1 : undefined
          }
        },
        headers: {
          "apns-priority": options.priority === "high" ? "10" : "5"
        }
      } : undefined
    };
    
    // Send notification
    await admin.messaging().send(message);
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send notification"
    };
  }
}

/**
 * Send a simple ping to check device reachability
 */
export async function pingDevice(deviceId: string | DeviceInfo): Promise<boolean> {
  try {
    // Handle both device ID string and DeviceInfo object
    let fcmToken: string | undefined;
    let id: string;
    
    if (typeof deviceId === 'string') {
      id = deviceId;
      const token = await getDeviceFcmToken(deviceId);
      if (token) {
        fcmToken = token;
      }
    } else {
      id = deviceId.id;
      fcmToken = deviceId.fcmToken;
    }
    
    if (!fcmToken) {
      return false;
    }
    
    // Send minimal ping notification
    const result = await notifyDevice({
      type: "ping",
      fcmToken,
      data: {
        ping: "true"
      }
    });
    
    return result.success;
  } catch (error) {
    console.error(`Failed to ping device ${typeof deviceId === 'string' ? deviceId : deviceId.id}:`, error);
    return false;
  }
}

/**
 * Send a login request notification
 */
export async function sendLoginRequest(
  deviceId: string,
  requestId: string,
  origin: string
): Promise<boolean> {
  try {
    const result = await notifyDevice({
      type: "login_request",
      deviceId,
      title: "Login Request",
      body: `Login requested from ${origin}`,
      priority: "high",
      contentAvailable: true,
      clickAction: "AUTHENTICATE_ACTION",
      data: {
        requestId,
        origin,
      }
    });
    
    return result.success;
  } catch (error) {
    console.error("Error sending login request notification:", error);
    return false;
  }
}

/**
 * Send a batch of notifications to multiple devices
 */
export async function notifyMultipleDevices(
  options: NotificationOptions,
  deviceIds: string[]
): Promise<BatchNotificationResult> {
  let success = 0;
  let failed = 0;
  
  // Get tokens for all devices
  const deviceTokensPromises = deviceIds.map(id => getDeviceFcmToken(id));
  const deviceTokens = await Promise.all(deviceTokensPromises);
  
  // Filter out null tokens and create a list of valid tokens
  const validTokens = deviceTokens.filter(token => token !== null) as string[];
  
  // Process in batches of 500 (FCM limit)
  const batchSize = 500;
  for (let i = 0; i < validTokens.length; i += batchSize) {
    const batch = validTokens.slice(i, i + batchSize);
    
    try {
      // Prepare base message data
      const baseData = {
        type: options.type,
        timestamp: Date.now().toString(),
        ...(options.data || {})
      };
      
      // Prepare android notification if title/body provided
      const androidNotification = options.title || options.body ? {
        title: options.title,
        body: options.body,
        icon: options.icon,
        color: options.color,
        clickAction: options.clickAction
      } : undefined;
      
      // Prepare APNS payload if title/body provided
      const apnsPayload = options.title || options.body ? {
        payload: {
          aps: {
            alert: {
              title: options.title,
              body: options.body
            },
            badge: options.badge,
            sound: options.sound || "default",
            "content-available": options.contentAvailable ? 1 : undefined
          }
        },
        headers: {
          "apns-priority": options.priority === "high" ? "10" : "5"
        }
      } : undefined;
      
      // Send messages in parallel
      const sendPromises = batch.map(token => 
        admin.messaging().send({
          token,
          data: baseData,
          android: androidNotification ? {
            notification: androidNotification,
            priority: options.priority || "high"
          } : undefined,
          apns: apnsPayload
        }).then(() => true).catch(() => false)
      );
      
      // Wait for all sends to complete
      const results = await Promise.all(sendPromises);
      
      // Count successes and failures
      const batchSuccesses = results.filter(result => result).length;
      success += batchSuccesses;
      failed += (batch.length - batchSuccesses);
    } catch (error) {
      console.error("Error sending batch notifications:", error);
      failed += batch.length;
    }
  }
  
  return { success, failed };
}
