import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Container } from '../../components/layout/Container';
import { UsersTable } from './UsersTable';
import { API_URL } from '../../config/env';

export function AdminUsuariosScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
      setUsers(data.users);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Panel de Usuarios</Text>
        {loading
          ? <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          : <UsersTable users={users} />
        }
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    padding: 24,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  pageTitle: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  loader: { marginTop: 100 },
});