/**
 * @file AppSnackBar.js
 * @description Componente de notificación (snackbar) para mostrar mensajes de éxito o error al usuario.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { theme } from '../../theme';

/**
 * Componente AppSnackbar
 * @param {Boolean} visible - Controla si el snackbar se muestra o no
 * @param {String} message - Mensaje a mostrar
 * @param {String} variant - Tipo de mensaje ('normal' o 'error')
 * @param {Function} onDismiss - Función al cerrar el snackbar
 * @param {Number} duration - Duración del mensaje en milisegundos
 */
export default function AppSnackbar({ visible, message, variant = 'normal', onDismiss, duration = 3000 }) {
  const isError = variant === 'error';

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        style={[
            styles.snackbar,
            { backgroundColor: isError ? theme.colors.danger : theme.colors.cardBackground }
        ]}
        wrapperStyle={styles.snackbarWrapper}
        action={{
          label: 'Cerrar',
          textColor: isError ? '#FFFFFF' : theme.colors.primary,
          onPress: onDismiss,
          labelStyle: { fontWeight: 'bold' }
        }}
      >
        <Text style={styles.messageText}>{message}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    zIndex: 9999,
  },
  snackbarWrapper: {
    width: 'auto',
    minWidth: 320,
    maxWidth: '90%',
    position: 'relative',
    bottom: 0,
  },
  snackbar: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  }
});