'use client';

import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native-web';
import HomeScreen from '@app/screens/HomeScreen';
import ProfileScreen from '@app/screens/ProfileScreen';
import SettingsScreen from '@app/screens/SettingsScreen';
import PipeGuru from '@app/sdk';
import { INITIAL_PARAMS } from '@app/config/navigationConfig';

type Screen = 'Home' | 'Profile' | 'Settings';

export default function PreviewNativePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize PipeGuru only on client-side after mount
  useEffect(() => {
    console.log('[PreviewNative] Initializing PipeGuru');
    PipeGuru.initialize('demo-api-key');

    // Wait for initial campaigns to load before rendering screens
    const handleFirstLoad = () => {
      console.log('[PreviewNative] First campaigns loaded, setting initialized');
      setIsInitialized(true);
      PipeGuru._off('campaigns_updated', handleFirstLoad);
    };

    PipeGuru._on('campaigns_updated', handleFirstLoad);
  }, []);

  // Mock navigation object for screens
  const mockNavigation: any = {
    navigate: (screen: Screen) => setCurrentScreen(screen),
    goBack: () => setCurrentScreen('Home'),
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen navigation={mockNavigation} username={INITIAL_PARAMS.Home.username} />;
      case 'Profile':
        return <ProfileScreen navigation={mockNavigation} />;
      case 'Settings':
        return <SettingsScreen navigation={mockNavigation} />;
      default:
        return <HomeScreen navigation={mockNavigation} username={INITIAL_PARAMS.Home.username} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-4">
        <h1 className="text-2xl font-bold text-white mb-4">React Native App Preview</h1>

        {/* Screen Selector Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentScreen('Home')}
            className={`px-4 py-2 rounded ${
              currentScreen === 'Home'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentScreen('Profile')}
            className={`px-4 py-2 rounded ${
              currentScreen === 'Profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setCurrentScreen('Settings')}
            className={`px-4 py-2 rounded ${
              currentScreen === 'Settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Phone Frame with React Native App */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-[375px] h-[812px] bg-white rounded-[50px] shadow-2xl overflow-hidden border-[14px] border-black">
          {/* Status Bar Background */}
          <div className="absolute top-0 left-0 right-0 h-11 bg-[#007AFF] z-10" />

          {/* React Native App Container */}
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
            {isInitialized ? (
              <View style={styles.appContainer}>
                {renderScreen()}
              </View>
            ) : (
              <View style={styles.appContainer}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p>Loading...</p>
                </div>
              </View>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    height: '100%',
  },
});
