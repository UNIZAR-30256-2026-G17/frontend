import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { useAuth } from '../../context/AuthContext';
import { DelitosTable } from './DelitosTable';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { API_URL } from '../../config/env';

export function AdminDelitosScreen() {
  const { user } = useAuth();
  const [delitos, setDelitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  useEffect(() => {
    if (user?.token) fetchDelitos();
  }, [user]);

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  const fetchDelitos = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      const response = await fetch(`${API_URL}/crimes?limit=50`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los delitos');
      }

      setDelitos(data.crimes || []);
    } catch (error) {
      console.error('Error fetching delitos:', error);
      showSnackbar('No se pudieron cargar los delitos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleDelito = async (id, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = currentStatus === 'available' ? 'deleted' : 'available';
      const token = user?.token;

      const response = await fetch(`${API_URL}/crimes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado en el servidor');
      }

      setDelitos((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, status: newStatus } : d
        )
      );
      
      showSnackbar(newStatus === 'deleted' ? 'Delito eliminado' : 'Delito restaurado');

    } catch (error) {
      console.error('Error toggling delito:', error);
      showSnackbar('Error al cambiar el estado del delito', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          scrollEventThrottle={16}
        >
          <Text style={styles.pageTitle}>Delitos</Text>

          {loading ? (
            <AppLoading message="Cargando delitos..." style={styles.centerLoader} />
          ) : (
            <DelitosTable delitos={delitos} onToggle={toggleDelito} />
          )}

        </ScrollView>
      </View>

      <LoadingOverlay visible={actionLoading} message="Procesando..." />
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
  centerLoader: {
    marginTop: 60,
  }
});