/**
 * @file AdminAlertasScreen.js
 * @description Pantalla de administración para la gestión global de alertas ciudadanas.
 * Permite filtrar, ordenar, visualizar y restaurar/eliminar alertas del sistema.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Text, ScrollView, StyleSheet, RefreshControl, View, useWindowDimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useScroll } from '../../context/ScrollContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import AlertasTable from './tables/AlertasTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import TableSkeleton from '../../components/ui/TableSkeleton';
import AppSnackbar from '../../components/ui/AppSnackBar';
import FadeInView from '../../components/animations/FadeInView';
import { API_URL } from '../../config/env';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import DateInput from '../../components/ui/DateInput';
import FilterPopover from '../../components/ui/FilterPopover';
import { UseAlertasFilter, ORDER_OPTIONS, STATUS_OPTIONS } from './filters/UseAlertasFilter';
import SummaryCardsComponent from '../../components/ui/SummaryCards';

/**
 * Componente AdminAlertasScreen
 */
export function AdminAlertasScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { handleScroll } = useScroll();
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  const { user } = useAuth();

  // Hook personalizado para la lógica de filtrado de alertas
  const {
    filteredData,
    order, setOrder,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    soloConConfirmaciones, setSoloConConfirmaciones,
    numFiltrosActivos,
    resetFilters,
  } = UseAlertasFilter(alertas);

  /**
   * Obtiene la lista de alertas desde la API
   */
  const fetchAlertas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/alerts`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener las alertas');
      setAlertas(data.alerts || []);
    } catch {
      showSnackbar('No se pudieron cargar las alertas', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.token]);

  // Cargar alertas al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user?.token) fetchAlertas();
  }, [user?.token, fetchAlertas]);

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
   * Maneja el refresco manual de la lista (pull-to-refresh)
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchAlertas();
  };

  /**
   * Cambia el estado de una alerta (Eliminar/Restaurar)
   * @param {String} id - ID de la alerta
   * @param {String} currentStatus - Estado actual ('pending', 'deleted', etc.)
   */
  const toggleAlerta = async (id, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = currentStatus === 'deleted' ? 'pending' : 'deleted';
      const response = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error();
      setAlertas(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      showSnackbar(newStatus === 'deleted' ? 'Alerta eliminada' : 'Alerta restaurada');
    } catch {
      showSnackbar('No se pudo cambiar el estado de la alerta', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const hasData = !loading && alertas.length > 0;

  return (
    <Container>
      <FadeInView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          >
            <Text style={styles.pageTitle}>Panel de Alertas</Text>

            {/* ── Tarjetas de Resumen KPI ── */}
            {hasData && (
              <SummaryCardsComponent
                data={[
                  { label: 'Total Alertas', value: alertas.length, icon: 'list-alt', color: theme.colors.primary },
                  { label: 'Pendientes', value: alertas.filter(a => a.status !== 'deleted').length, icon: 'clock-o', color: '#F5C842' },
                  { label: 'Confirmadas', value: alertas.filter(a => a.confirmations?.length > 0).length, icon: 'check-circle', color: '#2ECC71' },
                  { label: 'Eliminadas', value: alertas.filter(a => a.status === 'deleted').length, icon: 'trash', color: '#E74C3C' },
                ]}
              />
            )}

            {/* ── Barra de Acciones y Ordenación ── */}
            {
              hasData && (
                <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
                  <View style={styles.filterButtonWrapper}>
                    <Button
                      title="Filtrar"
                      icon="filter"
                      variant="primary"
                      onPress={() => setShowFilters(true)}
                    />
                    {numFiltrosActivos > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{numFiltrosActivos}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.orderContainer, isMobile && styles.fullWidth]}>
                    <Text style={styles.orderLabel}>Ordenar por</Text>
                    <Dropdown
                      options={ORDER_OPTIONS}
                      selected={order}
                      onSelect={setOrder}
                      placeholder="Ordenar por..."
                    />
                  </View>
                </View>
              )
            }

            {/* ── Estado de Carga / Tabla / Estados Vacíos ── */}
            {
              loading && !refreshing ? (
                <TableSkeleton rows={8} cols={4} />
              ) : alertas.length === 0 ? (
                <EmptyState
                  icon="bell-slash"
                  title="No hay alertas registradas"
                  subtitle="El sistema no tiene reportes actuales. Tira hacia abajo para refrescar."
                  buttonText="Buscar nuevas alertas"
                  onButtonPress={fetchAlertas}
                />
              ) : filteredData.length === 0 ? (
                <EmptyState
                  icon="search-minus"
                  title="No se encontraron alertas"
                  subtitle="Prueba ajustando los filtros para ver más resultados."
                  buttonText="Limpiar filtros"
                  onButtonPress={resetFilters}
                />
              ) : (
                <>
                  <Text style={styles.resultsText}>
                    {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
                  </Text>
                  <AlertasTable alertas={filteredData} onToggle={toggleAlerta} />
                </>
              )
            }

          </ScrollView >
        </View >
      </FadeInView >

      {/* ── Modal de Filtros Avanzados ── */}
      < FilterPopover visible={showFilters} onClose={() => setShowFilters(false)
      }>

        <Text style={styles.filterGroupTitle}>Estado</Text>
        <View style={styles.toggleGroup}>
          {STATUS_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={statusFilter?.value === opt.value}
              onToggle={(val) => setStatusFilter(val ? opt : null)}
            />
          ))}
        </View>

        <Text style={styles.filterGroupTitle}>Confirmaciones</Text>
        <View style={styles.toggleGroup}>
          <ToggleButton
            title="Solo con confirmaciones"
            selected={soloConConfirmaciones}
            onToggle={setSoloConConfirmaciones}
          />
        </View>

        <Text style={styles.filterGroupTitle}>Fecha desde</Text>
        <View style={styles.dateGroup}>
          <DateInput
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="01-02-2026"
            icon={null}
          />
        </View>

      </FilterPopover >

      <LoadingOverlay visible={actionLoading} message="Actualizando alerta..." />
      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </Container >
  );
}

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
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap'
  },
  topBarMobile: { justifyContent: 'flex-start' },
  filterButtonWrapper: { position: 'relative', overflow: 'visible', marginTop: 6, marginRight: 6 },
  orderContainer: { width: 320 },
  fullWidth: { width: '100%' },
  orderLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs
  },
  resultsText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  },
  filterGroupTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg
  },
  toggleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  },
  dateGroup: { width: 160 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: theme.colors.tableBorder,
    borderRadius: theme.radii.full,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  badgeText: {
    color: theme.colors.primaryButtonText,
    fontSize: 10,
    fontWeight: '700',
    includeFontPadding: false,
  },
});