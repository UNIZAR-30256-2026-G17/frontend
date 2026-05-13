/**
 * @file AppLoading.js
 * @description Componente de carga para toda la aplicación. Muestra un spinner y un mensaje opcional.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';

/**
 * Componente AppLoading
 * @param {String} message - Mensaje a mostrar debajo del spinner
 * @param {Object} style - Estilos adicionales para el contenedor
 */
export default function AppLoading({ message = 'Cargando...', style }) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        animating 
        size="large" 
        color={theme.colors.primary} 
      />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontSize: 14,
  },
});
