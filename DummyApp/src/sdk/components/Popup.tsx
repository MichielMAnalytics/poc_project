import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {defaultTheme} from '../theme';

export interface PopupProps {
  visible: boolean;
  title: string;
  message: string;
  primaryButton?: string;
  secondaryButton?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onDismiss?: () => void;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  title,
  message,
  primaryButton,
  secondaryButton,
  onPrimaryPress,
  onSecondaryPress,
  onDismiss,
}) => {
  const theme = defaultTheme;

  console.log('[Popup] Rendering with visible:', visible, 'title:', title);

  if (!visible) {
    return null;
  }

  // Use absolutely positioned View instead of Modal for web compatibility
  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.popup,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
          },
        ]}>
        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontFamily: theme.fonts.bold,
              marginBottom: theme.spacing.sm,
            },
          ]}>
          {title}
        </Text>

        {/* Message */}
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.regular,
              marginBottom: theme.spacing.lg,
            },
          ]}>
          {message}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {primaryButton && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.borderRadius.md,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                },
              ]}
              onPress={onPrimaryPress}>
              <Text
                style={[
                  styles.buttonText,
                  styles.primaryButtonText,
                  {
                    fontFamily: theme.fonts.bold,
                  },
                ]}>
                {primaryButton}
              </Text>
            </TouchableOpacity>
          )}

          {secondaryButton && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  paddingVertical: theme.spacing.md,
                  paddingHorizontal: theme.spacing.lg,
                },
              ]}
              onPress={onSecondaryPress}>
              <Text
                style={[
                  styles.buttonText,
                  styles.secondaryButtonText,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.fonts.medium,
                  },
                ]}>
                {secondaryButton}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  popup: {
    width: Dimensions.get('window').width - 80,
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    alignItems: 'center',
  },
  primaryButton: {},
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
  },
  buttonText: {},
});

export default Popup;
