import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Container } from '../../components/layout/Container';

// Importa tus componentes
import { CrimesByDistrictChart } from './CrimesByDistrictChart';
import { CrimesTodayChart } from './CrimesTodayChart';
import { VictimsTodayChart } from './VictimsTodayChart';
import { CrimeTypesStats } from './CrimeTypesStats';

// Importa tus datos
import { barData, lineData, pieData, statsData } from './mockData';

export const EstadisticasScreen = () => {
  // Obtenemos el ancho de la pantalla en tiempo real
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Definimos el punto de quiebre (breakpoint)

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Estadísticas</Text>
          <Text style={styles.updateText}>Última actualización: 25/02/2026 a las 12:44</Text>
        </View>

        {/* Usamos un contenedor con flexDirection dinámico. 
           Si es móvil, los elementos se apilan. Si es web, se ponen a la par.
        */}
        <View style={[styles.mainLayout, { flexDirection: isMobile ? 'column' : 'row' }]}>
          
          {/* COLUMNA IZQUIERDA (o Superior en móvil) */}
          <View style={[styles.section, !isMobile && { flex: 1.2 }]}>
            <CrimesByDistrictChart data={barData} />
            <View style={{ height: 16 }} /> {/* Espaciador */}
            <VictimsTodayChart data={pieData} />
          </View>

          {/* Espacio entre columnas en escritorio */}
          {!isMobile && <View style={{ width: 16 }} />}
          {isMobile && <View style={{ height: 16 }} />}

          {/* COLUMNA DERECHA (o Inferior en móvil) */}
          <View style={[styles.section, !isMobile && { flex: 1 }]}>
            <CrimesTodayChart data={lineData} />
            <View style={{ height: 16 }} /> {/* Espaciador */}
            <CrimeTypesStats data={statsData} />
          </View>

        </View>

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  updateText: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  mainLayout: {
    width: '100%',
  },
  section: {
    width: '100%',
  },
});