/**
 * Type declarations for web globals when running react-native-web
 */

declare global {
  interface Window {
    localStorage: Storage;
  }

  var window: Window | undefined;
  var navigator: Navigator | undefined;
}

export {};
