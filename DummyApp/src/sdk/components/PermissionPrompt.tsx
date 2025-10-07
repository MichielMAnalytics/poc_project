import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeContext';
import {
  requestPermission,
  type PermissionType,
  type PermissionStatus,
} from '../utils/permissionHandler';

export interface PermissionPromptProps {
  visible: boolean;
  permissionType: PermissionType;
  title: string;
  message: string;
  allowButton?: string;
  denyButton?: string;
  onPermissionResult?: (status: PermissionStatus) => void;
  onDismiss?: () => void;
}

/**
 * PermissionPrompt Component
 *
 * Shows a pre-permission prompt, then triggers the actual OS permission dialog.
 * This is the recommended UX pattern (ask why before showing OS prompt).
 */
const PermissionPrompt: React.FC<PermissionPromptProps> = ({
  visible,
  permissionType,
  title,
  message,
  allowButton = 'Continue',
  denyButton = 'Not Now',
  onPermissionResult,
  onDismiss,
}) => {
  const theme = useTheme();
  const [requesting, setRequesting] = useState(false);

  const getIcon = () => {
    switch (permissionType) {
      case 'notifications':
        return '🔔';
      case 'location':
        return '📍';
      case 'camera':
        return '📷';
      case 'photos':
        return '🖼️';
      default:
        return '❓';
    }
  };

  const handleAllow = async () => {
    console.log(`[PermissionPrompt] User tapped Allow for ${permissionType}`);
    setRequesting(true);

    try {
      // Trigger the actual OS permission dialog
      const status = await requestPermission(permissionType);
      console.log(`[PermissionPrompt] Permission result: ${status}`);

      onPermissionResult?.(status);
      onDismiss?.();
    } catch (error) {
      console.error('[PermissionPrompt] Error requesting permission:', error);
      onPermissionResult?.('denied');
      onDismiss?.();
    } finally {
      setRequesting(false);
    }
  };

  const handleDeny = () => {
    console.log(`[PermissionPrompt] User denied ${permissionType}`);
    onPermissionResult?.('denied');
    onDismiss?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.prompt}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getIcon()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons - iOS style (stacked vertically) */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleDeny}
              disabled={requesting}>
              <Text style={styles.secondaryButtonText}>{denyButton}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleAllow}
              disabled={requesting}>
              <Text style={styles.primaryButtonText}>
                {requesting ? 'Requesting...' : allowButton}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  prompt: {
    width: 270, // iOS alert standard width
    maxWidth: 270,
    minHeight: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 14, // iOS standard corner radius
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  icon: {
    fontSize: 48,
    color: '#000',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.29)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44, // iOS standard button height
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.29)',
  },
  primaryButton: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0, // Last button has no border
  },
  primaryButtonText: {
    color: '#007AFF', // iOS blue
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#007AFF',
  },
  buttonText: {},
});

export default PermissionPrompt;
