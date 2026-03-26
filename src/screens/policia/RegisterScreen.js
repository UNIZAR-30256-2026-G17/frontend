import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export const RegisterScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  const handleRegister = () => {
    // TODO: lógica de registro
    console.log('Register:', email, password, badgeNumber);
  };

  return (
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
              source={require('../../../assets/icon.png')}
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
            onPress={() => navigation.navigate('Login')}
          />
        </Card>
      </View>
    </ScrollView>
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
    ...theme.typography.title,
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