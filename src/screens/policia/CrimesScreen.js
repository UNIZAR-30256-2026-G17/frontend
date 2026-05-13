import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
import SummaryCards from '../../components/ui/SummaryCards';
import FilterPopover from '../../components/ui/FilterPopover';
import { useScroll } from '../../context/ScrollContext';

// Filtros predeterminados
export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
  { label: 'Distrito (A-Z)', value: 'district_asc' },
  { label: 'Tipo de delito (A-Z)', value: 'type_asc' },
];

// Tipos de delitos
export const TIPO_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Delito contra la sociedad', value: 'Delito contra la sociedad' },
  { label: 'Delito contra personas', value: 'Delito contra personas' },
  { label: 'Delito contra la propiedad', value: 'Delito contra la propiedad' },
];

// Distritos disponibles
export const DISTRITO_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Takoma Park', value: 'Takoma Park' },
  { label: 'Silver Spring', value: 'Silver Spring' },
  { label: 'Bethesda', value: 'Bethesda' },
  { label: 'Rockville', value: 'Rockville' },
  { label: 'Montgomery Village', value: 'Montgomery Village' },
  { label: 'Germantown', value: 'Germantown' },
  { label: 'Wheaton', value: 'Wheaton' },
];

export const BEAT_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: '1A1', value: '1A1' },
  { label: '1A2', value: '1A2' },
  { label: '1A3', value: '1A3' },
  { label: '1A4', value: '1A4' },
  { label: '1B1', value: '1B1' },
  { label: '1B2', value: '1B2' },
  { label: '1B3', value: '1B3' },
  { label: '1B4', value: '1B4' },
  { label: '1H2', value: '1H2' },
  { label: '1N2', value: '1N2' },
  { label: '1R2', value: '1R2' },
  { label: '2D1', value: '2D1' },
  { label: '2D2', value: '2D2' },
  { label: '2D3', value: '2D3' },
  { label: '2D4', value: '2D4' },
  { label: '2E1', value: '2E1' },
  { label: '2E2', value: '2E2' },
  { label: '2E3', value: '2E3' },
  { label: '2E4', value: '2E4' },
  { label: '3G1', value: '3G1' },
  { label: '3G2', value: '3G2' },
  { label: '3G3', value: '3G3' },
  { label: '3G4', value: '3G4' },
  { label: '3G5', value: '3G5' },
  { label: '3H1', value: '3H1' },
  { label: '3H2', value: '3H2' },
  { label: '3I1', value: '3I1' },
  { label: '3I2', value: '3I2' },
  { label: '3I3', value: '3I3' },
  { label: '3L1', value: '3L1' },
  { label: '4J1', value: '4J1' },
  { label: '4J2', value: '4J2' },
  { label: '4J3', value: '4J3' },
  { label: '4J4', value: '4J4' },
  { label: '4K1', value: '4K1' },
  { label: '4K2', value: '4K2' },
  { label: '4K3', value: '4K3' },
  { label: '4K4', value: '4K4' },
  { label: '4L1', value: '4L1' },
  { label: '4L2', value: '4L2' },
  { label: '4L3', value: '4L3' },
  { label: '5M1', value: '5M1' },
  { label: '5M2', value: '5M2' },
  { label: '5M3', value: '5M3' },
  { label: '5N1', value: '5N1' },
  { label: '5N2', value: '5N2' },
  { label: '5N3', value: '5N3' },
  { label: '6P1', value: '6P1' },
  { label: '6P2', value: '6P2' },
  { label: '6P3', value: '6P3' },
  { label: '6P4', value: '6P4' },
  { label: '6P6', value: '6P6' },
  { label: '6R1', value: '6R1' },
  { label: '6R2', value: '6R2' },
  { label: '6R3', value: '6R3' },
  { label: '8T1', value: '8T1' },
  { label: '8T2', value: '8T2' },
  { label: '8T3', value: '8T3' },
  { label: '-PG', value: '-PG' },
];

export function CrimesScreen() {
  const { handleScroll } = useScroll();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

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
    resetFilters,
  } = useCrimesFilter();

  useEffect(() => {
    // Simulamos carga inicial
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const numFiltrosActivos = [
    tipoFilter?.value,
    distritoFilter?.value,
    beatFilter?.value,
    dateFrom,
  ].filter(Boolean).length;

  // DEBUG LOGS
  console.log("--- CHEQUEO DE COMPONENTES ---");
  console.log("Container:", !!Container);
  console.log("Button:", !!Button);
  console.log("Dropdown:", !!Dropdown);
  console.log("CreateCrimesTable:", !!CreateCrimesTable);
  console.log("useCrimesFilter:", !!useCrimesFilter);
  console.log("SummaryCards:", !!SummaryCards);
  console.log("FilterPopover:", !!FilterPopover);
  console.log("FadeInView:", !!FadeInView);
  console.log("------------------------------");

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
            <SummaryCards
              data={[
                { label: 'Total Delitos', value: filteredData.length, icon: 'shield', color: theme.colors.primary },
                { label: 'Distritos', value: new Set(filteredData.map(d => d.distrito)).size, icon: 'map-marker', color: '#F1C40F' },
                { label: 'Sociedad', value: filteredData.filter(d => d.tipo === 'Delito contra la sociedad').length, icon: 'users', color: '#3498DB' },
                { label: 'Personas', value: filteredData.filter(d => d.tipo === 'Delito contra personas').length, icon: 'user-secret', color: '#E67E22' },
              ]}
            />
          )}

          {/* ── Barra superior ── */}
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

          {/* ── Tabla de resultados ── */}
          {loading ? (
            <TableSkeleton rows={10} cols={4} />
          ) : filteredData.length > 0 ? (
            <>
              <Text style={styles.resultsText}>
                {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
              </Text>
              <CreateCrimesTable data={filteredData} />
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

      {/* ── Modal de filtros ── */}
      <FilterPopover
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <Text style={styles.filterGroupTitle}>Tipo de delito</Text>
        <View style={styles.toggleGroup}>
          {TIPO_OPTIONS.filter(o => o.value).map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={tipoFilter?.value === opt.value}
              onToggle={(val) => setTipoFilter(val ? opt : TIPO_OPTIONS[0])}
            />
          ))}
        </View>

        <View style={styles.threeColRow}>
          {[
            { label: 'Distrito', options: DISTRITO_OPTIONS, selected: distritoFilter, onSelect: setDistritoFilter },
            { label: 'Beat', options: BEAT_OPTIONS, selected: beatFilter, onSelect: setBeatFilter },
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

        <Text style={styles.filterGroupTitle}>Fecha</Text>
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
    marginBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 25,
    marginBottom: 20,
  },
  orderContainer: {
    width: 320,
  },
  orderLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: 4,
  },
  filterGroupTitle: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
    marginBottom: 8,
    marginTop: 18,
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
    marginBottom: 8,
  },
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