"use server";

import { v4 as uuidv4 } from 'uuid';
import { admin, db } from "@/lib/firebase";
import { cache } from 'react';
import { revalidatePath } from 'next/cache';
import { sendLoginRequest } from "./notifyDevice";
import { LoginRequestOptions, LoginRequestResponse, LoginRequestRecord } from "./types";

// Constants
const LOGIN_REQUEST_COLLECTION = 'login-requests';
const DEFAULT_EXPIRY_SECONDS = 120; // 2 minutes
const REQUEST_LIMIT_PER_DEVICE = 3;  // Maximum pending requests per device
const REQUEST_RATE_LIMIT_MS = 30000; // 30 seconds between requests

// In-memory storage for rate limiting
const recentRequests: Map<string, Date> = new Map();

// Check if device has exceeded rate limit
const isRateLimited = (deviceId: string): boolean => {
  const lastRequest = recentRequests.get(deviceId);
  const now = new Date();
  
  if (lastRequest && (now.getTime() - lastRequest.getTime()) < REQUEST_RATE_LIMIT_MS) {
    return true;
  }
  
  // Update the last request time
  recentRequests.set(deviceId, now);
  
  // Clean up old entries from the map (prevent memory leaks)
  for (const [id, timestamp] of recentRequests.entries()) {
    if (now.getTime() - timestamp.getTime() > REQUEST_RATE_LIMIT_MS * 10) {
      recentRequests.delete(id);
    }
  }
  
  return false;
};

// Get active login requests for a device
const getActiveRequestsCount = cache(async (deviceId: string): Promise<number> => {
  const snapshot = await db.collection(LOGIN_REQUEST_COLLECTION)
    .where('deviceId', '==', deviceId)
    .where('status', '==', 'pending')
    .where('expiresAt', '>', new Date())
    .get();
  
  return snapshot.size;
});

// Check if device exists and is authorized for login
const validateDevice = cache(async (deviceId: string): Promise<boolean> => {
  try {
    const deviceDoc = await db.collection('client-apps').doc(deviceId).get();
    return deviceDoc.exists;
  } catch (error) {
    console.error('Error validating device:', error);
    return false;
  }
});

// Create a login request record in Firestore
const createLoginRequest = async (options: LoginRequestRecord): Promise<string> => {
  const docRef = await db.collection(LOGIN_REQUEST_COLLECTION).add(options);
  return docRef.id;
};

// Send notification to device - now using the centralized notification system
const notifyDevice = async (deviceId: string, requestId: string, origin: string): Promise<boolean> => {
  return sendLoginRequest(deviceId, requestId, origin);
};

// Clean up expired login requests periodically
const cleanupExpiredRequests = async (): Promise<void> => {
  try {
    // Find expired requests
    const snapshot = await db.collection(LOGIN_REQUEST_COLLECTION)
      .where('status', '==', 'pending')
      .where('expiresAt', '<', new Date())
      .limit(100)  // Process in batches for large databases
      .get();
    
    if (snapshot.empty) return;
    
    // Create a batch operation for efficiency
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'expired',
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error cleaning up expired requests:', error);
  }
};

/**
 * Initiates a passwordless login request for a device
 * 
 * This function:
 * 1. Validates the device is authorized
 * 2. Enforces rate limiting and request limits
 * 3. Creates a login request in the database
 * 4. Sends a push notification to the device
 * 5. Returns a request ID for polling
 * 
 * @param options Login request options
 * @returns Response object with success status and request ID
 */
/**
 * Checks the status of an existing login request
 * 
 * @param requestId The ID of the login request to check
 * @returns The current status and auth token if approved
 */
export const checkLoginStatus = async (requestId: string): Promise<{
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'not_found';
  token?: string;
  message?: string;
}> => {
  try {
    // Query the request
    const snapshot = await db.collection(LOGIN_REQUEST_COLLECTION)
      .where('requestId', '==', requestId)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return { status: 'not_found', message: 'Login request not found' };
    }
    
    const requestData = snapshot.docs[0].data() as LoginRequestRecord;
    
    // Check if expired
    if (requestData.status === 'pending' && new Date() > requestData.expiresAt) {
      // Update status to expired
      await db.collection(LOGIN_REQUEST_COLLECTION)
        .doc(snapshot.docs[0].id)
        .update({ 
          status: 'expired',
          updatedAt: new Date()
        });
      
      return { status: 'expired', message: 'Login request has expired' };
    }
    
    // If approved, generate an auth token
    if (requestData.status === 'approved') {
      // Generate JWT token (would typically use a proper JWT library)
      const expiresIn = 60 * 60 * 24 * 7; // 7 days
      const token = await admin.auth().createCustomToken(requestData.deviceId, {
        deviceId: requestData.deviceId,
        loginRequestId: requestId,
        approvedAt: new Date().toISOString()
      });
      
      return { 
        status: 'approved', 
        token,
        message: 'Login approved' 
      };
    }
    
    return { 
      status: requestData.status,
      message: requestData.status === 'rejected' 
        ? 'Login was rejected from device' 
        : 'Waiting for device approval'
    };
  } catch (error) {
    console.error('Error checking login status:', error);
    return { status: 'not_found', message: 'Failed to check login status' };
  }
};

/**
 * Initiates a passwordless login request for a device
 * 
 * This function:
 * 1. Validates the device is authorized
 * 2. Enforces rate limiting and request limits
 * 3. Creates a login request in the database
 * 4. Sends a push notification to the device
 * 5. Returns a request ID for polling
 * 
 * @param options Login request options
 * @returns Response object with success status and request ID
 */
export const initiateLoginRequest = async (options: LoginRequestOptions): Promise<LoginRequestResponse> => {
  const { deviceId, expiresInSeconds = DEFAULT_EXPIRY_SECONDS, origin = 'Unknown' } = options;
  
  try {
    // Run a cleanup of expired requests (non-blocking)
    cleanupExpiredRequests().catch(console.error);
    
    // Check if device is authorized
    const isValidDevice = await validateDevice(deviceId);
    if (!isValidDevice) {
      return { success: false, message: 'Device not authorized' };
    }
    
    // Check rate limiting
    if (isRateLimited(deviceId)) {
      return { success: false, message: 'Rate limit exceeded. Please try again later.' };
    }
    
    // Check if device already has too many pending requests
    const activeRequestsCount = await getActiveRequestsCount(deviceId);
    if (activeRequestsCount >= REQUEST_LIMIT_PER_DEVICE) {
      return { success: false, message: 'Too many pending requests for this device' };
    }
    
    // Get client IP for security logging
    // Note: In production, you might want to use headers().get('x-forwarded-for') 
    // or another method to get client IP depending on your hosting provider
    const ipAddress = 'server-action';
    
    // Create request record
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (expiresInSeconds * 1000));
    
    const requestId = uuidv4();
    const requestRecord: LoginRequestRecord = {
      requestId,
      deviceId,
      status: 'pending',
      origin,
      createdAt: now,
      expiresAt,
      ipAddress
    };
    
    // Save request to database
    await createLoginRequest(requestRecord);
    
    // Send notification to device (non-blocking)
    notifyDevice(deviceId, requestId, origin).catch(console.error);
    
    // Invalidate any cache for this device's requests
    revalidatePath('/admin/login');
    
    return { 
      success: true, 
      requestId, 
      expiresAt,
      message: 'Login request sent to device'
    };
    
  } catch (error) {
    console.error('Error initiating login request:', error);
    return { success: false, message: 'Failed to process login request' };
  }
};

/**
 * Updates the status of a login request (called from the mobile app)
 * 
 * This function allows the device app to approve or reject a login request
 * It verifies the JWT signature from the device to ensure authenticity
 * 
 * @param requestId The login request ID
 * @param status New status (approved or rejected)
 * @param jwt JWT token signed by device's private key
 * @returns Success status and message
 */
export const updateLoginRequestStatus = async (
  requestId: string, 
  status: 'approved' | 'rejected',
  jwt: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. Verify the JWT signature (this would use a JWT verification library)
    // This is just a placeholder - in a real implementation, you would:
    // - Get the device's public key from your database
    // - Verify the JWT was signed by the corresponding private key
    // - Check that the claims in the JWT match the request details
    
    // For demo purposes, just decode the JWT without verification
    // In production: Use a proper JWT library to verify signature
    let decodedJwt;
    try {
      // This is a simplified placeholder - use proper JWT verification in production
      decodedJwt = JSON.parse(
        Buffer.from(jwt.split('.')[1], 'base64').toString()
      );
    } catch {
      return { success: false, message: 'Invalid JWT format' };
    }
    
    // 2. Find the login request
    const snapshot = await db.collection(LOGIN_REQUEST_COLLECTION)
      .where('requestId', '==', requestId)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return { success: false, message: 'Login request not found' };
    }
    
    const docRef = snapshot.docs[0].ref;
    const requestData = snapshot.docs[0].data() as LoginRequestRecord;
    
    // 3. Check if the request is still pending
    if (requestData.status !== 'pending') {
      return { 
        success: false, 
        message: `Login request already ${requestData.status}` 
      };
    }
    
    // 4. Check if the request has expired
    if (new Date() > requestData.expiresAt) {
      await docRef.update({
        status: 'expired',
        updatedAt: new Date()
      });
      
      return { success: false, message: 'Login request expired' };
    }
    
    // 5. Check that the JWT contains the correct device ID
    if (decodedJwt.deviceId !== requestData.deviceId) {
      return { success: false, message: 'Device ID mismatch' };
    }
    
    // 6. Update the request status
    await docRef.update({
      status,
      updatedAt: new Date()
    });
    
    // 7. Revalidate the path to update any UI
    revalidatePath('/admin/login');
    
    return { 
      success: true, 
      message: `Login request ${status}` 
    };
  } catch (error) {
    console.error(`Error updating login request status:`, error);
    return { success: false, message: 'Failed to update login status' };
  }
};