import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';
import { Header } from './Header';
import { AdminSidebar } from './AdminSidebar'; // Asegúrate de que la ruta sea correcta

export const AdminContainer = ({ children }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* El Header siempre se muestra arriba, igual que en el Container normal */}
        <Header />
        
        {/* Este contenedor divide el espacio restante en fila (horizontal) */}
        <View style={styles.bodyRow}>
          
          {/* Solo mostramos el Sidebar si estamos en resolución de escritorio */}
          {isDesktop && <AdminSidebar />}
          
          {/* El contenido principal ocupa el resto del espacio disponible */}
          <View style={styles.content}>
            {children}
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.headerBackground,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row', // Coloca el Sidebar y el Content uno al lado del otro
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // padding: 16, // Puedes descomentar esto si necesitas padding global
  },
});