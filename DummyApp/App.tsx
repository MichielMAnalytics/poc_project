/**
 * Dummy React Native App
 * Ready for WebView injection testing
 *
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import PipeGuru from './src/sdk';

// Initialize PipeGuru with your API key
PipeGuru.initialize('demo-api-key');

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <AppNavigator />
    </>
  );
}

export default App;
