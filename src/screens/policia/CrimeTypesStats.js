import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Card from '../../components/ui/Card'; 
import { theme } from '../../theme';

export const CrimeTypesStats = ({ data }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <Card title="Porcentaje de clasificación de los tipos de delito">
      <View style={styles.statsGrid}>
        {data.map((stat, index) => (
          <View 
            key={index} 
            style={[
              styles.statBox, 
              // En móvil forzamos 100%, en escritorio permitimos que crezcan
              { flexBasis: isMobile ? '100%' : '30%' }
            ]}
          >
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12, 
    marginTop: 10,
    justifyContent: 'space-between' // Para que el espacio sea uniforme
  },
  statBox: {
    // flexBasis se maneja dinámicamente arriba
    flexGrow: 1,
    backgroundColor: '#2A2A2A', 
    borderWidth: 1, 
    borderColor: '#444',
    borderRadius: 12, // Un poco más redondeado como en la foto
    padding: 16, 
    minHeight: 100, // Asegura un tamaño consistente
    justifyContent: 'center',
  },
  statLabel: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    marginBottom: 8,
  },
  statValue: { 
    fontSize: 32, // Un poco más grande para resaltar el porcentaje
    fontWeight: 'bold',
  },
});