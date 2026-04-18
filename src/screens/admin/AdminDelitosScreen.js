import React, { useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';

// Importa tu AdminContainer actualizado
import { AdminContainer } from '../../components/layout/AdminContainer'; 
import { DelitosTable } from './DelitosTable';
import { SAMPLE_DELITOS } from './delitos.constants';

export function AdminDelitosScreen() {
  const [delitos, setDelitos] = useState(SAMPLE_DELITOS);

  const toggleDelito = (id) => {
    setDelitos((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, estado: d.estado === 'Disponible' ? 'Eliminado' : 'Disponible' }
          : d
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
        <Text style={styles.pageTitle}>Delitos</Text>
        <DelitosTable delitos={delitos} onToggle={toggleDelito} />
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
    maxWidth: 1200,
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