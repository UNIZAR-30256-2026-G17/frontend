/**
 * @file EmptyState.js
 * @description Componente para mostrar cuando no hay datos o resultados en una lista o tabla.
 * Incluye un icono, título, subtítulo opcional y un botón de acción.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

/**
 * Componente EmptyState
 * @param {String} icon - Nombre del icono de FontAwesome
 * @param {String} title - Título principal
 * @param {String} subtitle - Mensaje secundario descriptivo
 * @param {String} buttonText - Texto del botón de acción
 * @param {Function} onButtonPress - Función al pulsar el botón
 */
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
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginTop: theme.spacing.xl,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 8px 32px ${theme.colors.glassShadow}, 0 0 0 1px ${theme.colors.glassBorder}`,
      },
      ios: {
        shadowColor: theme.colors.glassShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  icon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.8,
  },
  title: {
    ...theme.typography.cardTitle, 
    color: theme.colors.cardText,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.cardDescription,
    color: theme.colors.cardTextSecondary,
    textAlign: 'center',
    maxWidth: '80%',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primaryButtonBackground,
    borderRadius: theme.radii.sm,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.primaryButtonText,
  },
});
