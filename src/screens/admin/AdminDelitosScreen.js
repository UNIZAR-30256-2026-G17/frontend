/**
 * @file AdminDelitosScreen.js
 * @description Pantalla de administración para la gestión global del catálogo de delitos.
 * Permite filtrar, ordenar, visualizar y habilitar/deshabilitar delitos en el sistema.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Text, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import { useAuth } from '../../context/AuthContext';
import { useScroll } from '../../context/ScrollContext';
import { DelitosTable } from './tables/DelitosTable';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import TableSkeleton from '../../components/ui/TableSkeleton';
import AppSnackbar from '../../components/ui/AppSnackBar';
import FadeInView from '../../components/animations/FadeInView';
import SummaryCardsComponent from '../../components/ui/SummaryCards';
import { API_URL } from '../../config/env';

import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import DateInput from '../../components/ui/DateInput';
import FilterPopover from '../../components/ui/FilterPopover';
import { UseDelitosFilter, ORDER_OPTIONS, STATUS_OPTIONS } from './filters/UseDelitosFilter';

/**
 * Componente AdminDelitosScreen
 */
export function AdminDelitosScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useAuth();
  const { handleScroll } = useScroll();
  const [delitos, setDelitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });
  const [showFilters, setShowFilters] = useState(false);

  // Hook personalizado para la lógica de filtrado de delitos
  const {
    filteredData,
    order, setOrder,
    tipoFilter, setTipoFilter,
    distritoFilter, setDistritoFilter,
    beatFilter, setBeatFilter,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    tipoOptions, distritoOptions, beatOptions,
    numFiltrosActivos,
  } = UseDelitosFilter(delitos);

  /**
   * Obtiene la lista de delitos desde la API
   */
  const fetchDelitos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/crimes?limit=50`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener los delitos');
      setDelitos(data.crimes || []);
    } catch {
      showSnackbar('No se pudieron cargar los delitos', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Cargar delitos al montar el componente
  useEffect(() => {
    if (user?.token) fetchDelitos();
  }, [user, fetchDelitos]);

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
   * Cambia el estado de un delito (Habilitar/Deshabilitar)
   * @param {String} id - ID del delito
   * @param {String} currentStatus - Estado actual ('available' o 'deleted')
   */
  const toggleDelito = async (id, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = currentStatus === 'available' ? 'deleted' : 'available';
      const response = await fetch(`${API_URL}/crimes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error();
      setDelitos(prev => prev.map(d => d._id === id ? { ...d, status: newStatus } : d));
      showSnackbar(newStatus === 'deleted' ? 'Delito eliminado' : 'Delito restaurado');
    } catch {
      showSnackbar('Error al cambiar el estado del delito', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container>
      <FadeInView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Text style={styles.pageTitle}>Panel de delitos</Text>

            {/* ── Tarjetas de Resumen KPI ── */}
            {(!loading && delitos.length > 0) && (
              <SummaryCardsComponent
                data={[
                  { label: 'Total Delitos', value: delitos.length, icon: 'shield', color: theme.colors.primary },
                  { label: 'Disponibles', value: delitos.filter(d => d.status === 'available').length, icon: 'check-circle', color: '#2ECC71' },
                  { label: 'Eliminados', value: delitos.filter(d => d.status === 'deleted').length, icon: 'trash', color: '#E74C3C' },
                  { label: 'Distritos', value: new Set(delitos.map(d => d.district)).size, icon: 'map-o', color: '#F1C40F' },
                ]}
              />
            )}

            {/* ── Barra superior de Acciones ── */}
            {!loading && (
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
            )}

            {/* ── Esqueleto / Tabla ── */}
            {loading ? (
              <TableSkeleton rows={10} cols={4} />
            ) : (
              <>
                <Text style={styles.resultsText}>
                  {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
                </Text>
                <DelitosTable delitos={filteredData} onToggle={toggleDelito} />
              </>
            )}
          </ScrollView>
        </View>
      </FadeInView>

      {/* ── Modal de Filtros Avanzados ── */}
      <FilterPopover visible={showFilters} onClose={() => setShowFilters(false)}>

        <Text style={styles.filterGroupTitle}>Tipo de delito</Text>
        <View style={styles.toggleGroup}>
          {tipoOptions.filter(o => o.value).map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={tipoFilter?.value === opt.value}
              onToggle={(val) => setTipoFilter(val ? opt : null)}
            />
          ))}
        </View>

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

        <View style={styles.threeColRow}>
          {[
            { label: 'Distrito', options: distritoOptions, selected: distritoFilter, onSelect: setDistritoFilter },
            { label: 'Beat', options: beatOptions, selected: beatFilter, onSelect: setBeatFilter },
          ].map(({ label, options, selected, onSelect }) => (
            <View key={label} style={styles.col}>
              <Text style={styles.filterGroupTitle}>{label}</Text>
              <Dropdown
                options={options}
                selected={selected}
                onSelect={onSelect}
                placeholder={label}
              />
            </View>
          ))}
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
  threeColRow: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
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