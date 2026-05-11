import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { API_URL } from '../../config/env';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  const handleRegister = async () => {
    try {
      // 1. REGISTRO
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      console.log('Usuario creado correctamente');

      // 2. LOGIN AUTOMÁTICO
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'police',
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Error al iniciar sesión');
      }

      console.log('Usuario logueado correctamente:', loginData);

      // Guardar en context
      await login({ role: 'police', email: loginData.user?.email || email }, loginData.token);

      // Redirigir a pantalla policial
      navigation.navigate('Mapa Policial');

    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        alert(error.message);
      } else {
        Alert.alert('Error', error.message);
      }
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
            />

            <Input
              label="Contraseña"
              placeholder="Ejemplo123@"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              label="Número de placa"
              placeholder="1234"
              value={badgeNumber}
              onChangeText={setBadgeNumber}
              keyboardType="numeric"
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
    </Container>
  );
}

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