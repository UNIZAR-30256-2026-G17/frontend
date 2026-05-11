import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

import { Container } from '../components/layout/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

import { API_URL } from '../config/env';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showAlert = (title, msg) => {
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        showAlert('Error', 'Todos los campos son obligatorios');
        return;
      }

      // 1. Login para obtener el token
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      // 3. Guarda en contexto con datos reales del servidor
      await login({
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      });

      // 4. Navega según el rol devuelto por el servidor
      if (data.user.role === 'admin') {
        navigation.navigate('AlertasAdmin');
      } else {
        navigation.navigate('MapPolice');
      }

    } catch (error) {
      console.error('Login error:', error);
      showAlert('Error', error.message);
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Iniciar sesión</Text>

        <View style={styles.cardWrapper}>
          <Card>

            {/* Logo + nombre institución */}
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

            {/* Formulario */}
            <Input
              label="Correo"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña"
              placeholder="Ejemplo123@"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Iniciar sesión"
              variant="primary"
              onPress={handleLogin}
            />

            <Button
            title="Registrarse"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
            />
          </Card>
        </View>
      </ScrollView>
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
    marginBottom: 32,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  // Cabecera institución
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
  adminIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.headerBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
  },
  adminLogo: {
    width: 60,
    height: 60,
  },
});