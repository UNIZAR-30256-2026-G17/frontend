import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { theme } from '../../theme';

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
            { backgroundColor: isError ? '#B71C1C' : '#1A1A1A' }
        ]}
        wrapperStyle={styles.snackbarWrapper}
        action={{
          label: 'Cerrar',
          textColor: isError ? '#000000' : theme.colors.primary,
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
    paddingBottom: 20,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  }
});