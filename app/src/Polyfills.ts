// Polyfill for missing PlatformConstants in certain RN versions (e.g., RN 0.72.x with Expo)
import { NativeModules } from 'react-native';

if (!NativeModules.PlatformConstants) {
  NativeModules.PlatformConstants = {
    // Minimal set required by libraries that reference PlatformConstants
    isTesting: false,
    reactNativeVersion: { major: 0, minor: 72, patch: 0 },
    platform: 'android',
    // Provide default values for fields that may be accessed
    // You can extend this object if you encounter additional missing keys
    uiManagerConstants: {},
    forceTouchAvailable: false,
  } as any;
}
