import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCampaigns, Popup, PermissionPrompt} from '../sdk';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

const ProfileScreen: React.FC<Props> = ({navigation}) => {
  // SDK Integration - Get campaigns for this screen
  const {currentCampaign, dismissCampaign} = useCampaigns('Profile');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>@johndoe</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+1 234 567 8900</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>San Francisco, CA</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>January 2024</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.buttonText}>Go to Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* SDK Campaign - Automatically rendered based on campaign config */}
      {currentCampaign && currentCampaign.component === 'Popup' && (
        <Popup
          visible={true}
          title={currentCampaign.props.title}
          message={currentCampaign.props.message}
          primaryButton={currentCampaign.props.primaryButton}
          secondaryButton={currentCampaign.props.secondaryButton}
          onPrimaryPress={dismissCampaign}
          onSecondaryPress={dismissCampaign}
          onDismiss={dismissCampaign}
        />
      )}
      {currentCampaign && currentCampaign.component === 'PermissionPrompt' && (
        <PermissionPrompt
          visible={true}
          permissionType={currentCampaign.props.permissionType}
          title={currentCampaign.props.title}
          message={currentCampaign.props.message}
          allowButton={currentCampaign.props.allowButton}
          denyButton={currentCampaign.props.denyButton}
          onPermissionResult={(status) => {
            console.log(`[ProfileScreen] Permission result: ${status}`);
            dismissCampaign();
          }}
          onDismiss={dismissCampaign}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
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
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default ProfileScreen;
