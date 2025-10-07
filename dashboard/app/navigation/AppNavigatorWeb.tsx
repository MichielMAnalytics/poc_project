'use client';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@app/screens/HomeScreen';
import ProfileScreen from '@app/screens/ProfileScreen';
import SettingsScreen from '@app/screens/SettingsScreen';

export type RootStackParamList = {
  Home: {username?: string};
  Profile: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Web-compatible version of AppNavigator
 * Uses @react-navigation/stack instead of @react-navigation/native-stack
 * Mirrors the exact same configuration as the native AppNavigator
 */
const AppNavigatorWeb: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Dummy App'}}
          initialParams={{username: 'Jane Smith'}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{title: 'My Profile'}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Settings'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigatorWeb;
