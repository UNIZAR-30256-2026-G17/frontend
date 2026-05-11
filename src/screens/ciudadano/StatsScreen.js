import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';
import { theme } from '../../theme';
import { API_URL } from '../../config/env';

const nameMap = {
  'Crime Against Person':   'Violencia y delitos contra la persona',
  'Crime Against Property': 'Robos y hurtos',
  'Crime Against Society':  'Orden público y vandalismo',
};

const descriptionMap = {
  'Crime Against Person':   'Homicidio, agresión agravada, agresión simple, robo con violencia, secuestro, violación y abusos sexuales, trata de personas.',
  'Crime Against Property': 'Robo con allanamiento, robo de vehículos, carterismo, hurto en tiendas, robo en edificios.',
  'Crime Against Society':  'Destrucción de propiedad, conducta desordenada, incendio provocado, allanamiento.',
};

const options = [
  { label: 'Último día',     value: 1 },
  { label: 'Último mes',     value: 30 },
  { label: 'Último año',     value: 365 },
  { label: 'Últimos 3 años', value: 1095 },
];

export const StatsScreen = () => {
  const [selectedOption, setSelectedOption] = useState(options[1]);
  const [stats, setStats] = useState([]);

  const getColorByPercentage = (value) => {
    if (value >= 60) return theme.colors.danger;
    if (value >= 40) return theme.colors.warning;
    return theme.colors.success;
  };

  useEffect(() => {
    fetchStats();
  }, [selectedOption]);

  const fetchStats = async () => {
    try {
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - selectedOption.value * 86400000)
        .toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byCrimename1?from=${from}&to=${to}`,
      );
      const json = await response.json();
      setStats(json.results);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Estadísticas</Text>
        <View style={styles.content}>
          <Card
            title="Porcentaje de clasificación de los tipos de delitos"
            right={
              <Dropdown
                options={options}
                selected={selectedOption}
                onSelect={(opt) => setSelectedOption(opt)}
              />
            }
          >
            <View style={styles.layout}>
              {stats.map((item, i) => (
                <View key={i} style={{ flex: 1 }}>
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
          </Card>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { ...theme.typography.pageTitle, color: theme.colors.text, marginTop: 16, alignSelf: 'center' },
  content: { flex: 1, margin: 16 },
  layout: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  percentage: { ...theme.typography.statsPercentage, color: theme.colors.danger },
  secondaryText: { ...theme.typography.body, color: theme.colors.cardTextSecondary },
});