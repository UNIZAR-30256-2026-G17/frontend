import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Container } from '../../components/layout/Container';
import { UsersTable } from './UsersTable';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { API_URL } from '../../config/env';

export function AdminUsuariosScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

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
      setUsers(data.users || []);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          <Text style={styles.pageTitle}>Panel de Usuarios</Text>
          {loading ? (
            <AppLoading message="Cargando usuarios..." style={styles.centerLoader} />
          ) : (
            <UsersTable users={users} />
          )}
        </ScrollView>
      </View>

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
  centerLoader: {
    marginTop: 60,
  }
});