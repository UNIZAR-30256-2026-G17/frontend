import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
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
  const { user, login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // 1. Login para obtener el token
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'admin' }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

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
    position: 'relative', // Importante para que el badge se posicione respecto a este View
    marginBottom: 8,
  },
  adminIconContainer: {
    width: 100,           // Ancho del círculo
    height: 100,          // Alto del círculo (debe ser igual al ancho)
    borderRadius: 50,     // Exactamente la mitad del width/height para que sea redondo
    backgroundColor: theme.colors.headerBackground, // Color de fondo del círculo
    justifyContent: 'center',   // Centra el icono verticalmente
    alignItems: 'center',       // Centra el icono horizontalmente
    marginTo: 20,
    // Opcional: Sombreado para darle volumen (como en tu imagen)
    elevation: 4,               // Sombra en Android
    shadowColor: '#000',        // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
