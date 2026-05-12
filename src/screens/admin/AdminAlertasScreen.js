import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { AlertasTable } from './tables/AlertasTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { API_URL } from '../../config/env';

export function AdminAlertasScreen() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchAlertas();
    }
  }, [user]);

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  const fetchAlertas = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      const response = await fetch(`${API_URL}/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las alertas');
      }

      setAlertas(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alertas:', error);
      showSnackbar('No se pudieron cargar las alertas', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertas();
  };

  const toggleAlerta = async (id, currentStatus) => {
    try {
      setActionLoading(true);
      const token = user?.token;
      const newStatus = currentStatus === 'deleted' ? 'pending' : 'deleted';

      const response = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Error en la actualización');

      setAlertas((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
      
      showSnackbar(newStatus === 'deleted' ? 'Alerta eliminada' : 'Alerta restaurada');

    } catch (error) {
      showSnackbar('No se pudo cambiar el estado de la alerta', 'error');
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        >
          <Text style={styles.pageTitle}>Panel de Alertas</Text>

          {loading && !refreshing ? (
            <AppLoading message="Cargando alertas..." style={styles.centerLoader} />
          ) : alertas.length === 0 ? (
            <EmptyState
              icon="bell-slash"
              title="No hay alertas registradas"
              subtitle="El sistema no tiene reportes actuales. Tira hacia abajo para refrescar."
              buttonText="Buscar nuevas alertas"
              onButtonPress={fetchAlertas}
            />
          ) : (
            <AlertasTable alertas={alertas} onToggle={toggleAlerta} />
          )}
        </ScrollView>
      </View>

      <LoadingOverlay visible={actionLoading} message="Actualizando alerta..." />
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