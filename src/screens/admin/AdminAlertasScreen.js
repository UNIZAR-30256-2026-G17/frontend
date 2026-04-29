import React, { useState, useEffect } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { AlertasTable } from './AlertasTable';
import EmptyState from '../../components/ui/EmptyState';
import { API_URL } from '../../config/env';

export function AdminAlertasScreen() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    if (user?.token) {
      fetchAlertas();
    }
  }, [user]);

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

      // IMPORTANTE: Según tu log, la lista viene en data.alerts
      // Si data.alerts existe, la guardamos, si no, array vacío.
      setAlertas(data.alerts || []);

    } catch (error) {
      console.error('Error fetching alertas:', error);
      Alert.alert('Error', 'No se pudieron cargar las alertas');
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
      const token = user?.token;

      // Mapeo de estados de tu back: pending -> deleted
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

      // Actualizamos usando _id porque así viene en tu JSON
      setAlertas((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );

    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la alerta');
    }
  };

  return (
    <Container>
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
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
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
  loader: {
    marginTop: 100,
  }
});