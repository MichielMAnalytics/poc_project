/**
 * Permission Handler
 * Handles requesting native permissions that can be triggered remotely via campaigns
 */

import {Platform} from 'react-native';

export type PermissionType = 'camera' | 'location' | 'notifications' | 'photos';

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

/**
 * Request a specific permission
 * This will trigger the native OS permission dialog
 */
export async function requestPermission(
  type: PermissionType,
): Promise<PermissionStatus> {
  console.log(`[SDK] Requesting ${type} permission`);

  try {
    // For native platforms
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const {request, PERMISSIONS, RESULTS} =
        require('react-native-permissions');

      let permission;
      switch (type) {
        case 'camera':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA;
          break;
        case 'location':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          break;
        case 'photos':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
          break;
        case 'notifications':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.NOTIFICATIONS
              : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
          break;
        default:
          return 'unavailable';
      }

      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          return 'granted';
        case RESULTS.DENIED:
          return 'denied';
        case RESULTS.BLOCKED:
          return 'blocked';
        default:
          return 'unavailable';
      }
    }

    // For web platform - use browser APIs
    if (Platform.OS === 'web') {
      return await requestWebPermission(type);
    }

    return 'unavailable';
  } catch (error) {
    console.error(`[SDK] Error requesting ${type} permission:`, error);
    return 'denied';
  }
}

/**
 * Request permission using web browser APIs
 */
async function requestWebPermission(
  type: PermissionType,
): Promise<PermissionStatus> {
  console.log(`[SDK] Requesting web permission: ${type}`);

  try {
    switch (type) {
      case 'camera':
        // Request camera access via getUserMedia
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          // Stop stream immediately after permission granted
          stream.getTracks().forEach(track => track.stop());
          return 'granted';
        }
        return 'unavailable';

      case 'location':
        // Request location access
        if (navigator.geolocation) {
          return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
              () => resolve('granted'),
              error => {
                if (error.code === error.PERMISSION_DENIED) {
                  resolve('denied');
                } else {
                  resolve('unavailable');
                }
              },
            );
          });
        }
        return 'unavailable';

      case 'notifications':
        // Request notification permission
        if ('Notification' in window) {
          const result = await Notification.requestPermission();
          return result === 'granted' ? 'granted' : 'denied';
        }
        return 'unavailable';

      case 'photos':
        // Photo library not available in web
        console.log('[SDK] Photo library permission not available on web');
        return 'unavailable';

      default:
        return 'unavailable';
    }
  } catch (error) {
    console.error(`[SDK] Web permission error:`, error);
    return 'denied';
  }
}

/**
 * Check if a permission has been granted
 */
export async function checkPermission(
  type: PermissionType,
): Promise<PermissionStatus> {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const {check, PERMISSIONS, RESULTS} = require('react-native-permissions');

      let permission;
      switch (type) {
        case 'camera':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA;
          break;
        case 'location':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          break;
        case 'photos':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
          break;
        case 'notifications':
          permission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.NOTIFICATIONS
              : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
          break;
        default:
          return 'unavailable';
      }

      const result = await check(permission);

      switch (result) {
        case RESULTS.GRANTED:
          return 'granted';
        case RESULTS.DENIED:
          return 'denied';
        case RESULTS.BLOCKED:
          return 'blocked';
        default:
          return 'unavailable';
      }
    }

    return 'unavailable';
  } catch (error) {
    console.error(`[SDK] Error checking ${type} permission:`, error);
    return 'unavailable';
  }
}
