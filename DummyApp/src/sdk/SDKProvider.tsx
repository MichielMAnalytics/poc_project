import React, {ReactNode} from 'react';
import {ThemeProvider, AppTheme} from './ThemeContext';

interface SDKProviderProps {
  theme: AppTheme;
  children: ReactNode;
  apiKey?: string; // For future use when connecting to real API
}

/**
 * SDKProvider - Main entry point for the SDK
 *
 * Wrap your app with this provider to enable SDK features.
 *
 * @example
 * ```tsx
 * import {SDKProvider} from './sdk';
 * import {appTheme} from './theme/appTheme';
 *
 * function App() {
 *   return (
 *     <SDKProvider theme={appTheme} apiKey="your-api-key">
 *       <YourApp />
 *     </SDKProvider>
 *   );
 * }
 * ```
 */
export const SDKProvider: React.FC<SDKProviderProps> = ({
  theme,
  children,
  apiKey,
}) => {
  // In a real implementation, you might:
  // - Initialize analytics
  // - Fetch campaigns from API using apiKey
  // - Set up error tracking
  // - Configure feature flags

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
