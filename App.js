import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from './src/components/Container';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <Container>
      <View style={styles.contentArea}>
        <Text style={styles.welcomeText}>
          ¡Bienvenido a Montgomery App!
        </Text>
        <Text style={styles.subText}>
          Selecciona una pestaña en la cabecera para comenzar o inicia sesión.
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
