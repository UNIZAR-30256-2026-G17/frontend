/**
 * @file RegisterScreen.js
 * @description Pantalla de registro para nuevos agentes de policía.
 * Realiza el registro y el inicio de sesión automático tras el éxito.
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppSnackbar from '../../components/ui/AppSnackBar';

import { API_URL } from '../../config/env';

/**
 * Componente RegisterScreen
 */
export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  /**
   * Muestra un mensaje en el snackbar
   */
  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  /**
   * Oculta el snackbar
   */
  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  /**
   * Maneja el proceso de registro y login automático
   */
  const handleRegister = async () => {
    try {
      if (!email.trim() || !password.trim() || !badgeNumber.trim()) {
        showSnackbar('Todos los campos son obligatorios', 'error');
        return;
      }

      setLoading(true);

      // 1. REGISTRO EN LA API
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'police',
          badge_number: badgeNumber,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Error en registro');
      }

      // 2. LOGIN AUTOMÁTICO TRAS EL REGISTRO
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Error al iniciar sesión tras el registro');
      }

      // Guardar sesión en el contexto
      await login({ 
        role: 'police', 
        email: loginData.user?.email || email,
        token: loginData.token 
      });

      // Navegación a la pantalla policial
      navigation.navigate('Mapa Policial');

    } catch (error) {
      console.error('Registration error:', error);
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
      >
        <Text style={styles.pageTitle}>Registrarse</Text>

        <View style={styles.cardWrapper}>
          <Card>
            <View style={styles.institutionHeader}>
              <Text style={styles.institutionName}>Policía de Montgomery</Text>
              <Image
                source={require('../../../assets/montgomery-icon.png')}
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

            <Input
              label="Número de placa"
              placeholder="1234"
              value={badgeNumber}
              onChangeText={setBadgeNumber}
              keyboardType="numeric"
              icon="id-badge"
            />

            <Button
              title="Registrarse"
              variant="primary"
              onPress={handleRegister}
            />

            <Button
              title="Iniciar sesión"
              variant="secondary"
              onPress={() => navigation.navigate('Iniciar Sesión')}
            />
          </Card>
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} message="Creando cuenta..." />
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: theme.spacing.lg,
  },
  pageTitle: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxl,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  institutionHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  institutionName: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.sm,
  },
});