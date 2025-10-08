import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CampaignRenderer} from '../sdk';

type RootStackParamList = {
  Home: {username?: string};
  Profile: undefined;
  Settings: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route?: {params?: {username?: string}};
  username?: string; // For web preview direct prop
};

const HomeScreen: React.FC<Props> = ({navigation, route, username}) => {
  // Use route params if available (native app), otherwise use direct prop (web preview)
  const displayName = route?.params?.username || username || 'Guest';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home Screen</Text>
        <Text style={styles.subtitle}>
          Welcome to the Dummy App, {displayName}!
        </Text>

        {/* Inline campaigns render here (in content flow) */}
        <CampaignRenderer screen="Home" type="inline" />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.buttonText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This app is ready for SDK injection testing. The popup you see is
            dynamically injected by the SDK!
          </Text>
        </View>
      </View>

      {/* Overlay campaigns render here (popups, permissions) */}
      <CampaignRenderer screen="Home" type="overlay" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
