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

export const LoginPoliceScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        if (Platform.OS === 'web') {
          alert('Todos los campos son obligatorios');
        } else {
          Alert.alert('Error', 'Todos los campos son obligatorios');
        }
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'police' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      console.log('Policía logueado correctamente:', data);

      // 2. Con el token, pide los datos del usuario
      const meResponse = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        }
      });

      const meData = await meResponse.json();
      if (!meResponse.ok) throw new Error('Error obteniendo datos del usuario');
      // 3. Guarda en contexto con datos reales del servidor
      await login({
        email: meData.user.email,
        role: meData.user.role,
        token: data.token,
      });

      navigation.navigate('MapPolice');

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
        <Text style={styles.pageTitle}>Iniciar sesión</Text>

        <View style={styles.cardWrapper}>
          <Card>
            {/* Logo + nombre institución */}
            <View style={styles.institutionHeader}>
              <Text style={styles.institutionName}>Policía de Montgomery</Text>
              <Image
                source={require('../../../assets/montgomery-icon.png')}
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

            <Button
              title="Soy administrador"
              variant="tertiary"
              onPress={() => navigation.navigate('LoginAdmin')}
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