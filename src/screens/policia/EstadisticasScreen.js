import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Container } from '../../components/layout/Container';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/env';

import { CrimesByDistrictChart } from './CrimesByDistrictChart';
import { CrimesTodayChart } from './CrimesTodayChart';
import { VictimsTodayChart } from './VictimsTodayChart';
import { CrimeTypesStats } from './CrimeTypesStats';

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

  const fetchCrimeNames1 = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      const response = await fetch(
        `${API_URL}/crimes/byCrimename1?from=${from}&to=${today}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      );
      const json = await response.json();

      // Para el pie chart (VictimsTodayChart)
      setPieData(json.results.map(item => ({
        name: NAME_MAP[item.crimename1] ?? item.crimename1,
        value: item.num_victims,
        color: COLOR_MAP[item.crimename1] ?? '#888',
      })));

      // Para las stats (CrimeTypesStats)
      setStatsData(json.results.map(item => ({
        label: NAME_MAP[item.crimename1] ?? item.crimename1,
        value: `${Math.round(item.percentage)}%`,
        color: COLOR_MAP[item.crimename1] ?? '#888',
      })));

    } catch (error) {
      console.error('Error fetching crime names:', error);
    }
  }, [user?.token]);

  const fetchCrimesByDistrict = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/crimes/yesterday/byDistrict`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const json = await response.json();
      console.log('Response:', JSON.stringify(json));

      const colors = ['#8B0000', '#B22222', '#CD5C5C', '#D2691E', '#DAA520', '#BDB76B', '#8FBC8F'];
      setBarData(json.results.map((item, i) => ({
        name: item.district,
        value: item.num_crimes,
        color: colors[i % colors.length],
      })));
      setLastUpdate(json.date);
    } catch (error) {
      console.error('Error fetching crimes by district:', error);
    }
  }, [user?.token]);

  const fetchCrimesByHour = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/crimes/yesterday/byHour`, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const json = await response.json();
      setLineData(json.results.map(item => ({
        time: item.hour,
        value: item.num_crimes,
      })));
    } catch (error) {
      console.error('Error fetching crimes by hour:', error);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchCrimesByDistrict();
      fetchCrimesByHour();
      fetchCrimeNames1();
    }
  }, [user, fetchCrimesByDistrict, fetchCrimesByHour, fetchCrimeNames1]);

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Estadísticas</Text>
          <Text style={styles.updateText}>Última actualización: {lastUpdate || '—'}</Text>
        </View>

        <View style={[styles.mainLayout, { flexDirection: isMobile ? 'column' : 'row' }]}>

          <View style={[styles.section, !isMobile && { flex: 1.2 }]}>
            <CrimesByDistrictChart data={barData} />
            <View style={{ height: 16 }} />
            <VictimsTodayChart data={pieData} />
          </View>

          {!isMobile && <View style={{ width: 16 }} />}
          {isMobile && <View style={{ height: 16 }} />}

          <View style={[styles.section, !isMobile && { flex: 1 }]}>
            <CrimesTodayChart data={lineData} />
            <View style={{ height: 16 }} />
            <CrimeTypesStats data={statsData} />
          </View>

        </View>

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  updateText: { fontSize: 12, color: '#AAAAAA', marginTop: 4 },
  mainLayout: { width: '100%' },
  section: { width: '100%' },
});