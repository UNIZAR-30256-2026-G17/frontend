import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({
  title,
  icon,
  variant = 'primary',
  onPress,
  disabled = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const isIconOnly = icon && !title;

  const variants = {
    primary: {
      backgroundColor: theme.colors.primaryButtonBackground,
      textColor: theme.colors.primaryButtonText,
      iconColor: theme.colors.primaryButtonIcon,
      ...theme.shadows.glow(theme.colors.primary, 0.3),
    },
    secondary: {
      backgroundColor: theme.colors.secondaryButtonBackground,
      textColor: theme.colors.secondaryButtonText,
      iconColor: theme.colors.secondaryButtonIcon,
      borderColor: theme.colors.secondaryButtonBorder,
    },
    tertiary: {
      backgroundColor: theme.colors.tertiaryButtonBackground,
      textColor: theme.colors.tertiaryButtonText,
      iconColor: theme.colors.tertiaryButtonIcon,
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
    <AnimatedTouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        isIconOnly && styles.iconButton,
        {
          backgroundColor: current.backgroundColor,
          borderWidth: current.borderColor ? 1 : 0,
          borderColor: current.borderColor,
          opacity: disabled ? 0.2 : 1,
          transform: [{ scale: scaleAnim }],
          ...current,
        }
      ]}
      onPress={!disabled ? onPress : null}
      disabled={disabled}
    >
      {icon && (
        <FontAwesome
          name={icon}
          size={16}
          color={current.iconColor}
        />
      )}

      {title && (
        <Text style={[styles.text, { color: current.textColor, textDecorationLine: variant === 'tertiary' ? 'underline' : 'none', }]}>
          {title}
        </Text>
      )}
    </AnimatedTouchableOpacity>
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
    marginVertical: 4,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  text: {
    ...theme.typography.bodyBold,
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
