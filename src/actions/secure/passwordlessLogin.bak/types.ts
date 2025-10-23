/**
 * Type definitions for the passwordless login system
 */

// Device information types
export interface DeviceInfo {
  id: string;
  fcmToken: string;
  deviceName?: string;
  deviceOs?: "android" | "ios" | "web" | "unknown";
}

export interface ClientAppType {
  id: string;
  fcmToken: string;
  deviceName: string;
  deviceOs: "android" | "ios" | "web" | "unknown";
  lastActive: Date;
}

export interface DeviceWithReachabilityType extends ClientAppType {
  isReachable: boolean;
  lastChecked?: number;
}

// Notification types
export type NotificationType = 
  | "ping"               // Simple reachability check
  | "login_request"      // Request for authentication
  | "security_alert"     // Security related notifications
  | "info"               // General information
  | "welcome"            // New device registration
  | "update";            // System updates

export interface NotificationOptions {
  // Basic notification properties
  type: NotificationType;
  title?: string;
  body?: string;
  data?: Record<string, string>;
  
  // Appearance/behavior options
  badge?: number;
  sound?: string;
  clickAction?: string;
  icon?: string;
  color?: string;
  
  // Delivery options
  priority?: "high" | "normal";
  timeToLive?: number;   // in seconds
  contentAvailable?: boolean;
  
  // Device identification
  deviceId?: string;     // Either deviceId
  fcmToken?: string;     // Or fcmToken must be provided
}

// Login request types
export interface LoginRequestOptions {
  deviceId: string;
  expiresInSeconds?: number;
  origin?: string;
}

export interface LoginRequestResponse {
  success: boolean;
  requestId?: string;
  message?: string;
  expiresAt?: Date;
}

export interface LoginRequestRecord {
  requestId: string;
  deviceId: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  origin: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt?: Date;
  ipAddress?: string;
}

// Notification response types
export interface NotificationResult {
  success: boolean;
  message?: string;
}

export interface BatchNotificationResult {
  success: number;
  failed: number;
}
