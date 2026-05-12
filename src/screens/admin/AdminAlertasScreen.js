import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, RefreshControl, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { AlertasTable } from './tables/AlertasTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { API_URL } from '../../config/env';

import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import DateInput from '../../components/ui/DateInput';
import FilterPopover from '../../components/ui/FilterPopover';
import { UseAlertasFilter, ORDER_OPTIONS, STATUS_OPTIONS } from './filters/UseAlertasFilter';

export function AdminAlertasScreen() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  const { user } = useAuth();

  const {
    filteredData,
    order, setOrder,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    soloConConfirmaciones, setSoloConConfirmaciones,
    numFiltrosActivos,
    resetFilters,
  } = UseAlertasFilter(alertas);

  useEffect(() => {
    if (user?.token) fetchAlertas();
  }, [user]);

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  const fetchAlertas = async () => {
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
    } catch (error) {
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

          {/* ── Barra superior ── */}
          {hasData && (
            <View style={styles.topBar}>
              <View style={{ position: 'relative', overflow: 'visible', marginTop: 6, marginRight: 6 }}>
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
              <View style={styles.orderContainer}>
                <Text style={styles.orderLabel}>Ordenar por</Text>
                <Dropdown
                  options={ORDER_OPTIONS}
                  selected={order}
                  onSelect={setOrder}
                  placeholder="Ordenar por..."
                />
              </View>
            </View>
          )}

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
          )}

        </ScrollView>
      </View>

      {/* ── Modal de filtros ── */}
      <FilterPopover visible={showFilters} onClose={() => setShowFilters(false)}>

        <Text style={styles.filterGroupTitle}>Estado</Text>
        <View style={styles.toggleGroup}>
          {STATUS_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              defaultSelected={statusFilter?.value === opt.value}
              onToggle={(val) => setStatusFilter(val ? opt : null)}
            />
          ))}
        </View>

        <Text style={styles.filterGroupTitle}>Confirmaciones</Text>
        <View style={styles.toggleGroup}>
          <ToggleButton
            title="Solo con confirmaciones"
            defaultSelected={soloConConfirmaciones}
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

      </FilterPopover>

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
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  pageTitle: { ...theme.typography.pageTitle, color: theme.colors.text, textAlign: 'center', marginBottom: 24, marginTop: 20 },
  topBar: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 25, marginBottom: 20 },
  orderContainer: { width: 320 },
  orderLabel: { ...theme.typography.body, color: theme.colors.text, marginBottom: 4 },
  resultsText: { ...theme.typography.body, color: theme.colors.text, marginBottom: 8 },
  filterGroupTitle: { ...theme.typography.cardTitle, color: theme.colors.cardText, marginBottom: 8, marginTop: 18 },
  toggleGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dateGroup: { width: 160 },
  centerLoader: { marginTop: 60 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: theme.colors.tableBorder,
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    // Borde para separarlo visualmente del botón
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