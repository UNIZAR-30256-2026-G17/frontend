import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { useAuth } from '../../context/AuthContext';
import { DelitosTable } from './DelitosTable';
import { API_URL } from '../../config/env';

export function AdminDelitosScreen() {
  const { user } = useAuth();
  const [delitos, setDelitos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Se ejecuta al entrar a la pantalla
  useEffect(() => {
    if (user?.token) fetchDelitos();
  }, [user]);

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

      // Accedemos a la lista de delitos usando data.crimes (y le ponemos [] por si acaso viene vacío)
      setDelitos(data.crimes || []);

    } catch (error) {
      console.error('Error fetching delitos:', error);
      Alert.alert('Error', 'No se pudieron cargar los delitos desde el servidor');
    } finally {
      setLoading(false);
    }
  };

  const toggleDelito = async (id, currentStatus) => {
    try {
      // Tu backend espera 'available' o 'deleted'
      const newStatus = currentStatus === 'available' ? 'deleted' : 'available';
      const token = user?.token;

      // IMPORTANTE: Revisa en tu backend si esta es la ruta correcta para actualizar
      // Si tu archivo de rutas dice router.put('/:id', ...), entonces quítale el "/status" del final.
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

      // Si el backend lo guardó bien, actualizamos la tabla en pantalla
      setDelitos((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, status: newStatus } : d
        )
      );

    } catch (error) {
      console.error('Error toggling delito:', error);
      Alert.alert('Error', 'Hubo un problema al cambiar el estado del delito.');
    }
  };

  return (
    <Container>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
      >
        <Text style={styles.pageTitle}>Delitos</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <DelitosTable delitos={delitos} onToggle={toggleDelito} />
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
});