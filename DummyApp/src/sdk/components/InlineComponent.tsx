import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeContext';

export interface InlineComponentStyle {
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  marginVertical?: number;
  opacity?: number;
}

export interface InlineComponentButton {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

export interface InlineComponentProps {
  heading?: string;
  body?: string;
  caption?: string;
  icon?: string;
  button?: InlineComponentButton;
  secondaryButton?: InlineComponentButton;
  style?: InlineComponentStyle;
  alignment?: 'left' | 'center' | 'right';
}

/**
 * InlineComponent
 *
 * A flexible component that can be injected inline between existing UI elements.
 * Supports remote configuration of content, styling, and layout.
 * Returns null when no content is provided.
 */
const InlineComponent: React.FC<InlineComponentProps> = ({
  heading,
  body,
  caption,
  icon,
  button,
  secondaryButton,
  style = {},
  alignment = 'left',
}) => {
  const theme = useTheme();

  // Return null if no content is provided
  const hasContent = heading || body || caption || icon || button || secondaryButton;
  if (!hasContent) {
    return null;
  }

  // Determine text alignment
  const textAlign = alignment === 'center' ? 'center' : alignment === 'right' ? 'right' : 'left';

  // Determine flex alignment
  const alignItems = alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: style.backgroundColor || theme.colors.surface,
          padding: style.padding ?? 16,
          borderRadius: style.borderRadius ?? 12,
          borderWidth: style.borderWidth ?? 0,
          borderColor: style.borderColor || theme.colors.border,
          marginVertical: style.marginVertical ?? 16,
          opacity: style.opacity ?? 1,
          alignItems,
        },
      ]}>
      {/* Icon */}
      {icon && <Text style={styles.icon}>{icon}</Text>}

      {/* Heading */}
      {heading && (
        <Text
          style={[
            styles.heading,
            {
              color: style.textColor || theme.colors.text,
              textAlign,
            },
          ]}>
          {heading}
        </Text>
      )}

      {/* Body */}
      {body && (
        <Text
          style={[
            styles.body,
            {
              color: style.textColor || theme.colors.text,
              textAlign,
            },
          ]}>
          {body}
        </Text>
      )}

      {/* Caption */}
      {caption && (
        <Text
          style={[
            styles.caption,
            {
              color: style.textColor || theme.colors.textSecondary,
              textAlign,
            },
          ]}>
          {caption}
        </Text>
      )}

      {/* Buttons */}
      {(button || secondaryButton) && (
        <View style={styles.buttonContainer}>
          {secondaryButton && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  backgroundColor: secondaryButton.backgroundColor || 'transparent',
                  borderColor: secondaryButton.textColor || theme.colors.primary,
                },
              ]}
              onPress={secondaryButton.onPress}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: secondaryButton.textColor || theme.colors.primary,
                  },
                ]}>
                {secondaryButton.text}
              </Text>
            </TouchableOpacity>
          )}

          {button && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                {
                  backgroundColor: button.backgroundColor || theme.colors.primary,
                },
              ]}
              onPress={button.onPress}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: button.textColor || '#FFFFFF',
                  },
                ]}>
                {button.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 1.5,
    // backgroundColor and borderColor set dynamically
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default InlineComponent;
