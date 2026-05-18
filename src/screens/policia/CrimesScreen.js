/**
 * @file CrimesScreen.js
 * @description Pantalla para visualizar el listado de delitos registrados. 
 * Permite filtrar por tipo, distrito, beat y fecha, además de ordenar los resultados.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import DateInput from '../../components/ui/DateInput';
import CreateCrimesTable from './CreateCrimesTable';
import useCrimesFilter from './useCrimesFilter';
import EmptyState from '../../components/ui/EmptyState';
import TableSkeleton from '../../components/ui/TableSkeleton';
import FadeInView from '../../components/animations/FadeInView';
import SummaryCardsComponent from '../../components/ui/SummaryCards';
import FilterPopover from '../../components/ui/FilterPopover';
import { useScroll } from '../../context/ScrollContext';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/env';

// Opciones de ordenación predeterminadas
export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
  { label: 'Distrito (A-Z)', value: 'district_asc' },
  { label: 'Tipo de delito (A-Z)', value: 'type_asc' },
];

/**
 * Componente CrimesScreen
 */
export function CrimesScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { handleScroll } = useScroll();
  const { user } = useAuth();

  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [delitos, setDelitos] = useState([]);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  // Hook personalizado que gestiona toda la lógica de filtrado de delitos
  const {
    filteredData,
    order,
    setOrder,
    tipoFilter,
    setTipoFilter,
    distritoFilter,
    setDistritoFilter,
    beatFilter,
    setBeatFilter,
    dateFrom,
    setDateFrom,
    tipoOptions,
    distritoOptions,
    beatOptions,
    resetFilters,
    numFiltrosActivos,
  } = useCrimesFilter(delitos);

  const fetchDelitos = useCallback(async (isLoadMore = false) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const currentOffset = isLoadMore ? offset + 50 : 0;
      const response = await fetch(`${API_URL}/crimes?limit=50&offset=${currentOffset}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener los delitos');

      const newCrimes = data.crimes || [];

      if (newCrimes.length < 50) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isLoadMore) {
        setDelitos(prev => {
          const existingIds = new Set(prev.map(d => d._id));
          const uniqueNewCrimes = newCrimes.filter(d => !existingIds.has(d._id));
          return [...prev, ...uniqueNewCrimes];
        });
        setOffset(currentOffset);
      } else {
        setDelitos(newCrimes);
        setOffset(0);
      }
    } catch (e) {
      console.error('Error fetching crimes:', e);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [user?.token, offset]);

  // Carga inicial
  useEffect(() => {
    if (user?.token && !loadingMore && offset === 0) fetchDelitos(false);
  }, [user]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && !isFetchingRef.current) {
      fetchDelitos(true);
    }
  };

  return (
    <Container>
      <FadeInView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={styles.pageTitle}>Listado de delitos</Text>

          {/* ── Summary Cards ── */}
          {(!loading && filteredData.length > 0) && (
            <SummaryCardsComponent
              data={[
                { label: 'Total Delitos', value: filteredData.length, icon: 'shield', color: theme.colors.primary },
                { label: 'Distritos', value: new Set(filteredData.map(d => d.district)).size, icon: 'map-marker', color: theme.colors.warning },
                { label: 'Sociedad', value: filteredData.filter(d => d.crimename1?.toLowerCase().includes('society')).length, icon: 'users', color: '#3498DB' },
                { label: 'Personas', value: filteredData.filter(d => d.crimename1?.toLowerCase().includes('person')).length, icon: 'user-secret', color: '#E67E22' },
              ]}
            />
          )}

          {/* ── Barra superior (Filtros y Ordenación) ── */}
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

          {/* ── Tabla de resultados o estado vacío ── */}
          {loading ? (
            <TableSkeleton rows={10} cols={4} />
          ) : filteredData.length > 0 ? (
            <>
              <Text style={styles.resultsText}>
                {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
              </Text>
              <CreateCrimesTable data={filteredData} onLoadMore={handleLoadMore} />
              {loadingMore && (
                <View style={{ padding: theme.spacing.md, alignItems: 'center' }}>
                  <Text style={{ color: theme.colors.text }}>Cargando más delitos...</Text>
                </View>
              )}
            </>
          ) : (
            <EmptyState
              icon="search-minus"
              title="No se encontraron delitos"
              subtitle="Prueba ajustando los filtros para ver más resultados."
              buttonText="Limpiar filtros"
              onButtonPress={resetFilters}
            />
          )}
        </ScrollView>
      </FadeInView>

      {/* ── Modal de filtros (Popover) ── */}
      <FilterPopover
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <Text style={styles.filterGroupTitle}>Tipo de delito</Text>
        <View style={styles.toggleGroup}>
          {tipoOptions?.filter(o => o.value).map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={tipoFilter?.value === opt.value}
              onToggle={(val) => setTipoFilter(val ? opt : null)}
            />
          ))}
        </View>

        <View style={styles.threeColRow}>
          {[
            { label: 'Distrito', options: distritoOptions || [], selected: distritoFilter, onSelect: setDistritoFilter },
            { label: 'Beat', options: beatOptions || [], selected: beatFilter, onSelect: setBeatFilter },
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

    </Container>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  pageTitle: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 25,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  topBarMobile: {
    justifyContent: 'flex-start',
  },
  filterButtonWrapper: {
    position: 'relative',
    overflow: 'visible',
    marginTop: 6,
    marginRight: 6,
  },
  orderContainer: {
    width: 320,
  },
  fullWidth: {
    width: '100%',
  },
  orderLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  filterGroupTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  toggleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  threeColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  dateGroup: {
    width: 160,
  },
  resultsText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
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
