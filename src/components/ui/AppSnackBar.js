import React from 'react';
import { StyleSheet, View } from 'react-native';
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
            { backgroundColor: isError ? theme.colors.danger : '#323232' }
        ]}
        wrapperStyle={styles.snackbarWrapper}
        action={{
          label: 'Cerrar',
          textColor: isError ? theme.colors.dangerButtonText : theme.colors.primaryButtonText,
          onPress: onDismiss,
        }}
      >
        {message}
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
    zIndex: 1000,
  },
  snackbarWrapper: {
    width: 'auto',
    minWidth: 300,
    maxWidth: '90%',
    position: 'relative',
    bottom: 0,
  },
  snackbar: {
    borderRadius: 8,
  }
});