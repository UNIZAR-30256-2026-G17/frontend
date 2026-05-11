import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';

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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    color: theme.colors.text,
    fontSize: 14,
  },
});
