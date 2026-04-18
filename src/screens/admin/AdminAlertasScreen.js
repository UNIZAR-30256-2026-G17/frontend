import React, { useState } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';

import { AdminContainer } from '../../components/layout/AdminContainer'; 
import { AlertasTable } from './AlertasTable';
import { SAMPLE_ALERTAS } from './alertas.constants';

export function AdminAlertasScreen() {
  const [alertas, setAlertas] = useState(SAMPLE_ALERTAS);

  const toggleAlerta = (id) => {
    setAlertas((prev) =>
      prev.map((alerta) =>
        alerta.id === id
          ? { 
              ...alerta, 
              // Si está eliminada, la restauramos a Pendiente. Si no, la eliminamos.
              estado: alerta.estado === 'Eliminada' ? 'Pendiente' : 'Eliminada' 
            }
          : alerta
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
        <Text style={styles.pageTitle}>Alertas</Text>
        <AlertasTable alertas={alertas} onToggle={toggleAlerta} />
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