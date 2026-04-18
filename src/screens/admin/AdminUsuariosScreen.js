import React, { useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';

// Importa tu AdminContainer actualizado
import { AdminContainer } from '../../components/layout/AdminContainer'; 
import { UsersTable } from './UsersTable';
import { SAMPLE_USERS } from './usuarios.constants';

export function AdminUsuariosScreen() {
  const [users, setUsers] = useState(SAMPLE_USERS);

  const toggleUser = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, estado: u.estado === 'Activo' ? 'Bloqueado' : 'Activo' }
          : u
      )
    );
  };

  return (
    <AdminContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
      >
        <Text style={styles.pageTitle}>Usuarios</Text>
        <UsersTable users={users} onToggle={toggleUser} />
      </ScrollView>
    </AdminContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
});