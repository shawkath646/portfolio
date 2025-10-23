# Passwordless Login System

This module implements a secure passwordless authentication system that allows users to log in using trusted devices with biometric authentication.

## Features

- **Device Registration**: Register trusted devices for passwordless authentication
- **Reachable Device Detection**: Check which registered devices are online and reachable
- **Login Request Management**: Initiate, check, and update login request status
- **Push Notification System**: Send different types of notifications to devices
- **Caching Strategies**: Optimized performance with multi-level caching
- **Security Controls**: Rate limiting, request limits, and expiration policies

## How It Works

1. **User Flow**:
   - User visits the login page
   - System shows a list of reachable trusted devices
   - User selects a device
   - Push notification is sent to the device
   - User authenticates on device using biometrics
   - User is logged in on the web application

2. **Technical Flow**:
   - Web app calls `initiateLoginRequest` with target device ID
   - System creates a login request record and sends notification via FCM
   - Mobile app receives notification and prompts for biometric authentication
   - After successful biometric auth, mobile app calls `updateLoginRequestStatus`
   - Web app polls `checkLoginStatus` until approved/rejected/expired
   - On approval, a secure JWT token is issued for the session

## Files

- **index.ts**: Exports all functionality
- **loginRequest.ts**: Manages login request lifecycle
- **reachableDeviceList.ts**: Detects which registered devices are online
- **notifyDevice.ts**: Centralized notification system

## Usage Examples

### Checking for Reachable Devices

```typescript
import { reachableDeviceList } from '@/actions/secure/passwordlessLogin';

// Get list of devices with reachability status
const devices = await reachableDeviceList();
```

### Initiating Login

```typescript
import { initiateLoginRequest } from '@/actions/secure/passwordlessLogin';

// Start login process
const result = await initiateLoginRequest({
  deviceId: 'selected-device-id',
  origin: 'Admin Dashboard'
});

if (result.success) {
  // Store requestId for polling
  const { requestId } = result;
}
```

### Checking Login Status

```typescript
import { checkLoginStatus } from '@/actions/secure/passwordlessLogin';

// Poll for status updates
const status = await checkLoginStatus(requestId);

if (status.status === 'approved') {
  // Use the token for authentication
  const { token } = status;
}
```

### Sending Notifications

```typescript
import { notifyDevice } from '@/actions/secure/passwordlessLogin';

// Send custom notification
await notifyDevice({
  type: 'info',
  deviceId: 'device-id',
  title: 'New Login',
  body: 'Your account was accessed from a new location'
});
```
