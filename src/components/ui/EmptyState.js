import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function EmptyState({
  icon = 'search-minus',
  title = 'No se encontraron resultados',
  subtitle,
  buttonText,
  onButtonPress,
}) {
  return (
    <View style={styles.container}>
      <FontAwesome
        name={icon}
        size={48}
        color={theme.colors.inputPlaceholder}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: 20,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    ...theme.typography.cardTitle, 
    color: theme.colors.cardText,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.cardDescription,
    color: theme.colors.cardTextSecondary,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primaryButtonBackground,
    borderRadius: 8,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.primaryButtonText,
  },
});
