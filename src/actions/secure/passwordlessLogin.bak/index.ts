"use server";

// Re-export all functionality from individual modules
export { 
  initiateLoginRequest,
  checkLoginStatus,
  updateLoginRequestStatus 
} from './loginRequest';

export { 
  reachableDeviceList 
} from './reachableDeviceList';

export { 
  notifyDevice,
  pingDevice,
  sendLoginRequest,
  notifyMultipleDevices,
  getDeviceInfo
} from './notifyDevice';

// Export all types from the centralized types file
export * from './types';

// Export testing utilities for development environments
export {
  registerTestDevice,
  simulateDeviceApproval,
  mockNotificationReceived,
  cleanupTestDevices
} from './testing';

// Export additional information about the module
export const passwordlessLoginInfo = {
  name: 'Passwordless Login System',
  version: '1.0.0',
  description: 'A secure passwordless login system using trusted devices and biometric authentication',
  features: [
    'Device registration',
    'Reachability checking',
    'Login requests via push notifications',
    'Biometric authentication',
    'Multiple device support',
    'Optimized caching',
    'Centralized notification system'
  ]
};
