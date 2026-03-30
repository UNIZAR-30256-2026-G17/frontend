import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import DateInput from '../../components/ui/DateInput';

import FilterPopover from './FilterPopover';
import { CreateCrimesTable } from './CreateCrimesTable';
import { UseCrimesFilter } from './UseCrimesFilter';
import EmptyState from './EmptyState';
import {
  ORDER_OPTIONS,
  TIPO_OPTIONS,
  DISTRITO_OPTIONS,
  BEAT_OPTIONS,
} from './crimes.constants';

export function CrimesScreen() {
  const [showFilters, setShowFilters] = useState(false);

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
  } = UseCrimesFilter();

  return (
    <Container>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
      >
        <Text style={styles.pageTitle}>Listado de delitos</Text>

        {/* ── Barra superior ── */}
        <View style={styles.topBar}>
          <Button
            title="Filtrar"
            icon="filter"
            variant="primary"
            onPress={() => setShowFilters(true)}
          />
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
        {filteredData.length > 0 ? (
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
              defaultSelected={tipoFilter?.value === opt.value}
              onToggle={(val) => setTipoFilter(val ? opt : TIPO_OPTIONS[0])}
            />
          ))}
        </View>

        <View style={styles.threeColRow}>
          {[
            { label: 'Distrito', options: DISTRITO_OPTIONS, selected: distritoFilter, onSelect: setDistritoFilter },
            { label: 'Beat',     options: BEAT_OPTIONS,     selected: beatFilter,     onSelect: setBeatFilter },
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
    marginBottom: 10,
  },
  orderContainer: {
    width: 350,
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
});