import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { Header } from './Header';

export const Container = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          {children}
        </View>
        <Header />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground || '#FFCC00',
    // Con react-native-safe-area-context, el paddingTop de StatusBar no suele ser necesario manualment
    // pero lo mantenemos si el diseño lo requiere.
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentWrapper: {
    flex: 1,
    // El padding top debe coincidir con la altura aproximada del Header
    // para que el contenido no empiece debajo de él, pero pueda desplazarse por debajo.
    paddingTop: 64, 
  },
});
