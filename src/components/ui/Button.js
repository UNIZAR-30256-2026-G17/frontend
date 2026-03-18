import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';


export default function Button({
  title,
  icon,
  variant = 'primary',
  onPress,
  disabled = false,
}) {

  const isIconOnly = icon && !title;

  const variants = {
    primary: {
      backgroundColor: theme.colors.primaryButtonBackground,
      textColor: theme.colors.primaryButtonText,
      iconColor: theme.colors.primaryButtonIcon,
    },
    secondary: {
      backgroundColor: theme.colors.secondaryButtonBackground,
      textColor: theme.colors.secondaryButtonText,
      iconColor: theme.colors.secondaryButtonIcon,
      borderColor: theme.colors.secondaryButtonBorder,
    },
    header: {
      backgroundColor: theme.colors.headerButtonBackground,
      textColor: theme.colors.headerButtonText,
      iconColor: theme.colors.headerButtonIcon,
    },
    danger: {
      backgroundColor: theme.colors.dangerButtonBackground,
      textColor: theme.colors.dangerButtonText,
      iconColor: theme.colors.dangerButtonIcon,
    },
    success: {
      backgroundColor: theme.colors.successButtonBackground,
      textColor: theme.colors.successButtonText,
      iconColor: theme.colors.successButtonIcon,
    },
  };

  const current = variants[variant] || variants.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isIconOnly && styles.iconButton,
        {
          backgroundColor: current.backgroundColor,
          borderWidth: current.borderColor ? 1 : 0,
          borderColor: current.borderColor,
          opacity: disabled ? 0.2 : 1,
        }
      ]}
      onPress={!disabled ? onPress : null}
      activeOpacity={disabled ? 1 : 0.8}
    >
      {icon && (
        <FontAwesome
          name={icon}
          size={16}
          color={current.iconColor}
        />
      )}

      {title && (
        <Text style={[styles.text, { color: current.textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
  },
  text: {
    ...theme.typography.body,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
