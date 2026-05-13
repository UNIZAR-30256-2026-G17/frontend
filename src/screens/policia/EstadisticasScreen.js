/**
 * @file EstadisticasScreen.js
 * @description Pantalla de visualización de analíticas para el personal policial.
 * Muestra gráficos detallados sobre criminalidad por distrito, hora, tipos de delitos y víctimas.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Container } from '../../components/layout/Container';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/env';
import { theme } from '../../theme';

import { CrimesByDistrictChart } from './CrimesByDistrictChart';
import { CrimesTodayChart } from './CrimesTodayChart';
import { VictimsTodayChart } from './VictimsTodayChart';
import { CrimeTypesStats } from './CrimeTypesStats';
import Dropdown from '../../components/ui/Dropdown';

// Opciones de filtrado temporal
const options = [
  { label: 'Último día', value: 1 },
  { label: 'Último mes', value: 30 },
  { label: 'Último año', value: 365 },
  { label: 'Últimos 3 años', value: 1095 },
];

/**
 * Componente EstadisticasScreen
 */
const COLOR_MAP = {
  'Crime Against Person': '#B22222',
  'Crime Against Property': '#DAA520',
  'Crime Against Society': '#4682B4',
};

const NAME_MAP = {
  'Crime Against Person': 'Delitos contra personas',
  'Crime Against Property': 'Delitos contra la propiedad',
  'Crime Against Society': 'Delitos contra la sociedad',
};

export const EstadisticasScreen = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useAuth();

  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [pieData, setPieData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [selectedOptionDistrict, setSelectedOptionDistrict] = useState(options[1]); // Por defecto: último mes
  const [selectedOptionHour, setSelectedOptionHour] = useState(options[1]);
  const [selectedOptionVictims, setSelectedOptionVictims] = useState(options[1]);
  const [selectedOptionCrimeTypes, setSelectedOptionCrimeTypes] = useState(options[1]);

  /**
   * Obtiene estadísticas de víctimas agrupadas por tipo general (para el gráfico de tarta)
   */
  const fetchVictimStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOptionVictims.value * 86400000).toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byCrimename1?from=${from}&to=${today}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      );
      const json = await response.json();

      setPieData(json.results.map(item => ({
        name: NAME_MAP[item.crimename1] ?? item.crimename1,
        value: item.num_victims,
        color: COLOR_MAP[item.crimename1] ?? '#888',
      })));
    } catch (error) {
      console.error('Error fetching victim stats:', error);
    }
  }, [user?.token, selectedOptionVictims]);

  /**
   * Obtiene porcentajes de clasificación de delitos (para las tarjetas de estadísticas)
   */
  const fetchCrimeTypeStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOptionCrimeTypes.value * 86400000).toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byCrimename1?from=${from}&to=${today}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      );
      const json = await response.json();

      setStatsData(json.results.map(item => ({
        label: NAME_MAP[item.crimename1] ?? item.crimename1,
        value: `${Math.round(item.percentage)}%`,
        color: COLOR_MAP[item.crimename1] ?? '#888',
      })));
    } catch (error) {
      console.error('Error fetching crime type stats:', error);
    }
  }, [user?.token, selectedOptionCrimeTypes]);

  /**
   * Obtiene el número de delitos en un rango de fechas desglosado por distrito
   */
  const fetchCrimesByDistrict = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOptionDistrict.value * 86400000).toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byDistrict?from=${from}&to=${today}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      );
      const json = await response.json();

      const colors = ['#8B0000', '#B22222', '#CD5C5C', '#D2691E', '#DAA520', '#BDB76B', '#8FBC8F'];
      setBarData(json.results.map((item, i) => ({
        name: item.district,
        value: item.num_crimes,
        color: colors[i % colors.length],
      })));
      setLastUpdate(json.to);
    } catch (error) {
      console.error('Error fetching crimes by district:', error);
    }
  }, [user?.token, selectedOptionDistrict]);

  /**
   * Obtiene el número de delitos en un rango de fechas desglosado por franja horaria
   */
  const fetchCrimesByHour = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOptionHour.value * 86400000).toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byHour?from=${from}&to=${today}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      );
      const json = await response.json();
      setLineData(json.results.map(item => ({
        time: item.hour,
        value: item.num_crimes,
      })));
    } catch (error) {
      console.error('Error fetching crimes by hour:', error);
    }
  }, [user?.token, selectedOptionHour]);

  // Cargar todos los datos estadísticos al montar el componente
  useEffect(() => {
    if (user?.token) {
      fetchCrimesByDistrict();
      fetchCrimesByHour();
      fetchVictimStats();
      fetchCrimeTypeStats();
    }
  }, [user, fetchCrimesByDistrict, fetchCrimesByHour, fetchVictimStats, fetchCrimeTypeStats]);

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Estadísticas</Text>
          <Text style={styles.updateText}>Última actualización: {lastUpdate || '—'}</Text>
        </View>

        <View style={[styles.mainLayout, { flexDirection: isMobile ? 'column' : 'row' }]}>

          {/* Columna Izquierda / Superior */}
          <View style={[styles.section, !isMobile && { flex: 1.2 }]}>
            <CrimesByDistrictChart
              data={barData}
              right={
                <Dropdown
                  options={options}
                  selected={selectedOptionDistrict}
                  onSelect={(opt) => setSelectedOptionDistrict(opt)}
                />
              }
            />
            <View style={{ height: theme.spacing.md }} />
            <VictimsTodayChart
              data={pieData}
              right={
                <Dropdown
                  options={options}
                  selected={selectedOptionVictims}
                  onSelect={(opt) => setSelectedOptionVictims(opt)}
                />
              }
            />
          </View>

          {!isMobile && <View style={{ width: theme.spacing.md }} />}
          {isMobile && <View style={{ height: theme.spacing.md }} />}

          {/* Columna Derecha / Inferior */}
          <View style={[styles.section, !isMobile && { flex: 1 }]}>
            <CrimesTodayChart
              data={lineData}
              right={
                <Dropdown
                  options={options}
                  selected={selectedOptionHour}
                  onSelect={(opt) => setSelectedOptionHour(opt)}
                />
              }
            />
            <View style={{ height: theme.spacing.md }} />
            <CrimeTypesStats
              data={statsData}
              right={
                <Dropdown
                  options={options}
                  selected={selectedOptionCrimeTypes}
                  onSelect={(opt) => setSelectedOptionCrimeTypes(opt)}
                />
              }
            />
          </View>

        </View>

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center'
  },
  mainTitle: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    textAlign: 'center'
  },
  updateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    fontFamily: theme.typography.body.fontFamily
  },
  mainLayout: { width: '100%' },
  section: { width: '100%' },
});