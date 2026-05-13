/**
 * @file AlertsScreen.js
 * @description Pantalla para la gestión de alertas por parte de la policía/admin.
 * Permite filtrar por estado y fecha, y realizar acciones sobre las alertas.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, RefreshControl } from 'react-native';
import { theme } from '../../theme';
import { Container } from '../../components/layout/Container';
import FadeInView from '../../components/animations/FadeInView';
import SummaryCards from '../../components/ui/SummaryCards';
import ToggleButton from '../../components/ui/ToggleButton';
import Dropdown from '../../components/ui/Dropdown';
import AlertCard from '../../components/ui/AlertCard';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { useAuth } from '../../context/AuthContext';
import { useScroll } from '../../context/ScrollContext';
import { API_URL } from '../../config/env';
import EmptyState from '../../components/ui/EmptyState';

// Opciones de filtrado por fecha
const FECHA_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Última semana', value: 'week' },
];

// Mapeo de etiquetas de UI a estados de API
const STATUS_MAP = {
  'Pendientes': 'pending',
  'Atendidas': 'attended',
  'Eliminadas': 'deleted',
};

/**
 * Componente AlertsScreen
 */
export const AlertsScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useAuth();
  const { handleScroll } = useScroll();
  
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Pendientes');
  const [dateFilter, setDateFilter] = useState(FECHA_OPTIONS[0]);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  // Carga inicial y cuando cambia el filtro de fecha
  useEffect(() => {
    if (user?.token) fetchAlerts();
  }, [user, dateFilter]);

  /**
   * Muestra un mensaje en el snackbar
   */
  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  /**
   * Oculta el snackbar
   */
  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  /**
   * Obtiene las alertas de la API según los filtros
   */
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      let url = `${API_URL}/alerts?`;
      
      // Aplicar filtro de fecha en la query
      if (dateFilter.value === 'today') {
        const today = new Date().toISOString().split('T')[0];
        url += `&from=${today}`;
      } else if (dateFilter.value === 'yesterday') {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        url += `&from=${yesterday}&to=${yesterday}`;
      } else if (dateFilter.value === 'week') {
        const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        url += `&from=${lastWeek}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener alertas');
      setAllAlerts(data.alerts || []);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Manejador para refrescar la lista (pull-to-refresh)
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  /**
   * Actualiza el estado de una alerta (atender/eliminar)
   */
  const updateAlertStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Error al actualizar la alerta');
      
      showSnackbar(newStatus === 'deleted' ? 'Alerta eliminada' : 'Alerta atendida');
      fetchAlerts();
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtrado en el frontend basado en el estado seleccionado
  const filteredAlerts = useMemo(() => {
    const targetStatus = STATUS_MAP[selectedStatus];
    return allAlerts.filter(a => a.status === targetStatus);
  }, [allAlerts, selectedStatus]);

  // Cálculo de totales para las SummaryCards
  const counts = useMemo(() => ({
    attended: allAlerts.filter(a => a.status === 'attended').length,
    deleted: allAlerts.filter(a => a.status === 'deleted').length,
    pending: allAlerts.filter(a => a.status === 'pending').length,
  }), [allAlerts]);

  return (
    <Container>
      <FadeInView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        >
          <Text style={styles.pageTitle}>Listado de alertas</Text>

          {/* ── Filtros ── */}
          <View style={[styles.filterBar, isMobile && styles.filterBarMobile]}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Estado de las alertas</Text>
              <View style={styles.toggleGroup}>
                {['Pendientes', 'Atendidas', 'Eliminadas'].map((state) => (
                  <ToggleButton
                    key={state}
                    title={state}
                    selected={selectedStatus === state}
                    onToggle={() => setSelectedStatus(state)}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.filterGroup, !isMobile && { width: 200 }]}>
              <Text style={styles.filterLabel}>Fecha</Text>
              <Dropdown
                options={FECHA_OPTIONS}
                selected={dateFilter}
                onSelect={setDateFilter}
                placeholder="Seleccionar fecha"
              />
            </View>
          </View>

          {/* ── Summary Cards ── */}
          <SummaryCards
            data={[
              { label: 'Atendidas', value: counts.attended, icon: 'check-circle', color: theme.colors.success },
              { label: 'Eliminadas', value: counts.deleted, icon: 'trash', color: theme.colors.danger },
              { label: 'Pendientes', value: counts.pending, icon: 'clock-o', color: theme.colors.warning },
            ]}
          />

          {/* ── Grid de Alertas ── */}
          {filteredAlerts.length === 0 && !loading ? (
            <EmptyState 
              icon="search"
              title="No hay alertas con este estado"
              subtitle="Intenta cambiar el filtro para ver otros resultados."
            />
          ) : (
            <View style={[styles.alertsGrid, isMobile ? styles.gridMobile : styles.gridDesktop]}>
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  isMobile={isMobile}
                  onDelete={(id) => updateAlertStatus(id, 'deleted')}
                  onAttend={(id) => updateAlertStatus(id, 'attended')}
                />
              ))}
            </View>
          )}

        </ScrollView>
      </FadeInView>
      
      <LoadingOverlay visible={actionLoading} message="Procesando..." />
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  container: { 
    padding: theme.spacing.xl, 
    paddingBottom: theme.spacing.xxxl, 
    width: '100%', 
    maxWidth: 1200, 
    alignSelf: 'center' 
  },
  pageTitle: { 
    ...theme.typography.pageTitle, 
    color: theme.colors.text, 
    textAlign: 'center', 
    marginBottom: theme.spacing.xxl,
    fontSize: 32,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.xxl,
    gap: 20,
  },
  filterBarMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  filterGroup: {
    gap: theme.spacing.sm,
  },
  filterLabel: {
    ...theme.typography.body,
    color: theme.colors.cardTextSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  alertsGrid: {
    marginTop: theme.spacing.xl,
    gap: 20,
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridMobile: {
    flexDirection: 'column',
  },
});

export default AlertsScreen;
