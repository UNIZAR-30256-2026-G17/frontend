import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { useScroll } from '../context/ScrollContext';

import { Container } from '../components/layout/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import AppSnackbar from '../components/ui/AppSnackBar';

import { API_URL } from '../config/env';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { handleScroll } = useScroll();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        showSnackbar('Todos los campos son obligatorios', 'error');
        return;
      }

      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      await login({
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      });

      if (data.user.role === 'admin') {
        navigation.navigate('Panel de Alertas');
      } else {
        navigation.navigate('Mapa Policial');
      }

    } catch (error) {
      console.error('Login error:', error);
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.pageTitle}>Iniciar sesión</Text>

        <View style={styles.cardWrapper}>
          <Card>
            <View style={styles.institutionHeader}>
              <Text style={styles.institutionName}>
                Policía de Montgomery
              </Text>

                <Image
                    source={require('../../assets/montgomery-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Input
              label="Correo"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="envelope"
            />

            <Input
              label="Contraseña"
              placeholder="Ejemplo123@"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock"
            />

            <Button
              title="Iniciar sesión"
              variant="primary"
              onPress={handleLogin}
            />

            <Button
            title="Registrarse"
            variant="secondary"
            onPress={() => navigation.navigate('Registro')}
            />
          </Card>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} message="Iniciando sesión..." />
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  pageTitle: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  institutionHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  institutionName: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
    marginBottom: 12,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
});