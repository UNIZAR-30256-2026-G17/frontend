/**
 * @file CrimeTypesStats.js
 * @description Componente de visualización de métricas clave por tipo de delito.
 * Muestra tarjetas con porcentajes descriptivos utilizando un sistema de cuadrícula flexible.
 */

import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';
import Card from '../../components/ui/Card';

/**
 * Componente CrimeTypesStats
 * @param {Array} data - Lista de objetos { label: string, value: string, color: string }
 * @param {React.ReactNode} right - Elemento opcional para mostrar en la parte derecha de la cabecera del Card
 */
export const CrimeTypesStats = ({ data, right }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <Card title="Porcentaje de clasificación de los tipos de delito" right={right}>
      <View style={styles.statsGrid}>
        {data.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statBox,
              // Ajuste de ancho responsivo: 100% en móvil, ~30% en escritorio
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
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    justifyContent: 'space-between'
  },
  statBox: {
    flexGrow: 1,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    minHeight: 100,
    justifyContent: 'center',
  },
  statLabel: {
    color: theme.colors.cardText,
    fontSize: 14,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.body.fontFamily,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: theme.typography.title.fontFamily,
  },
});