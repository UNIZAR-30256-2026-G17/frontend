import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { API_URL } from '../../config/api';

export const LoginAdminScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("DENTRO");
    try {
      if (!email.trim() || !password.trim()) {
        const msg = 'Todos los campos son obligatorios';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
        return;
      }

      // 1. Login para obtener el token
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }),
      });

      const data = await response.json();
      if (!response.ok) {
        const msg = 'Credenciales incorrectas';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
        return;
      }

      console.log('Admin logueado correctamente');

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

      navigation.navigate('AlertasAdmin');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
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
            {/* Logo + nombre institución CAMBIAR*/}
            <View style={styles.institutionHeader}>
              <Text style={styles.institutionName}>Administrador</Text>
              <View style={styles.imageContainer}>
                <View style={styles.adminIconContainer}>
                  <Image
                    source={require('../../../assets/admin.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

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
              title="Soy policía"
              variant="tertiary"
              onPress={() => navigation.navigate('LoginPolice')}
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
    width: 60,
    height: 60,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  adminIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.headerBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginTo: 20,
    elevation: 4,
  },
});
