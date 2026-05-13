/**
 * @file StatsScreen.js
 * @description Pantalla de estadísticas públicas para los ciudadanos.
 * Proporciona información sobre la distribución de delitos y descripciones educativas de las categorías.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/layout/Container';
import { useScroll } from '../../context/ScrollContext';
import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';
import { theme } from '../../theme';
import { API_URL } from '../../config/env';

// Mapeo de nombres técnicos a nombres legibles para el ciudadano
const nameMap = {
  'Crime Against Person': 'Violencia y delitos contra la persona',
  'Crime Against Property': 'Robos y hurtos',
  'Crime Against Society': 'Orden público y vandalismo',
};

// Descripciones explicativas de lo que incluye cada categoría
const descriptionMap = {
  'Crime Against Person': 'Homicidio, agresión agravada, agresión simple, robo con violencia, secuestro, violación y abusos sexuales, trata de personas.',
  'Crime Against Property': 'Robo con allanamiento, robo de vehículos, carterismo, hurto en tiendas, robo en edificios.',
  'Crime Against Society': 'Destrucción de propiedad, conducta desordenada, incendio provocado, allanamiento.',
};

// Opciones de filtrado temporal
const options = [
  { label: 'Último día', value: 1 },
  { label: 'Último mes', value: 30 },
  { label: 'Último año', value: 365 },
  { label: 'Últimos 3 años', value: 1095 },
];

/**
 * Componente StatsScreen
 */
export const StatsScreen = () => {
  const { handleScroll } = useScroll();
  const [selectedOption, setSelectedOption] = useState(options[1]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  /**
   * Determina el color del porcentaje basándose en la severidad (valor relativo)
   */
  const getColorByPercentage = (value) => {
    if (value >= 60) return theme.colors.danger;
    if (value >= 40) return theme.colors.warning;
    return theme.colors.success;
  };

  /**
   * Obtiene las estadísticas desde la API para el rango seleccionado
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOption.value * 86400000)
        .toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byCrimename1?from=${from}&to=${to}`,
      );
      const json = await response.json();
      setStats(json.results || []);
    } catch (e) {
      console.error('Error fetching stats:', e);
      setSnackbar({ visible: true, message: 'Error al cargar estadísticas', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedOption?.value]);

  // Recargar estadísticas cada vez que cambie el filtro de tiempo
  useEffect(() => {
    fetchStats();
  }, [selectedOption, fetchStats]);

  return (
    <Container>
      <ScrollView
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>Estadísticas</Text>
        <View style={styles.content}>
          <Card
            title="Distribución de delitos"
            right={
              <Dropdown
                options={options}
                selected={selectedOption}
                onSelect={(opt) => setSelectedOption(opt)}
              />
            }
          >
            {loading ? (
              <AppLoading message="Cargando estadísticas..." />
            ) : (
              <View style={styles.layout}>
                {stats.map((item, i) => (
                  <View key={i} style={styles.statCol}>
                    <Card title={nameMap[item.crimename1] ?? item.crimename1}>
                      <Text style={[styles.percentage, { color: getColorByPercentage(item.percentage) }]}>
                        {Math.round(item.percentage)}%
                      </Text>
                      <Text style={styles.secondaryText}>
                        {descriptionMap[item.crimename1] ?? ''}
                      </Text>
                    </Card>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={() => setSnackbar(prev => ({ ...prev, visible: false }))}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    ...theme.typography.pageTitle,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    alignSelf: 'center'
  },
  content: {
    flex: 1,
    margin: theme.spacing.lg
  },
  layout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm
  },
  statCol: {
    flex: 1,
    minWidth: 280
  },
  percentage: { ...theme.typography.statsPercentage },
  secondaryText: { ...theme.typography.body, color: theme.colors.cardTextSecondary },
});