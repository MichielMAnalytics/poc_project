/**
 * Dummy React Native App
 * Ready for WebView injection testing
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {SDKProvider} from './src/sdk';
import {appTheme} from './src/theme/appTheme';

function App() {
  return (
    <SDKProvider theme={appTheme} apiKey="demo-api-key">
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <AppNavigator />
    </SDKProvider>
  );
}

export default App;
