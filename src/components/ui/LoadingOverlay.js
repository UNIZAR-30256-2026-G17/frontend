import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';

export default function LoadingOverlay({ visible = false, message = 'Cargando...' }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator
          animating
          size="large"
          color={theme.colors.primary}
        />
        {message && (
          <Text style={styles.text}>{message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});