import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

const COLS_DESKTOP = [
  { key: 'correo', header: 'Correo' },
  { key: 'numeroPlaca', header: 'Número de placa' },
  { key: 'estado', header: 'Estado' },
];

export function UsersTable({ users, onToggle }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  // ─── VISTA DESKTOP ───
  if (!isMobile) {
    return (
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {COLS_DESKTOP.map((col) => (
            <Text 
              key={col.key} 
              // Si es la columna de correo, usamos un estilo específico alineado a la izquierda
              style={[styles.headerCell, col.key === 'correo' && styles.desktopCorreo]}
            >
              {col.header}
            </Text>
          ))}
          <View style={styles.headerBtnSpace} /> 
        </View>

        {users.map((row, i) => {
          const isActive = row.estado === 'Activo';
          return (
            <View key={row.id} style={rowStyle(i)}>
              {/* Aplicamos el estilo desktopCorreo alineado a la izquierda */}
              <Text style={[styles.cell, styles.desktopCorreo]}>{row.correo}</Text>
              <Text style={styles.cell}>{row.numeroPlaca}</Text>
              <Text style={styles.cell}>{row.estado}</Text>
              
              <View style={styles.actionCell}>
                <Button
                  title={isActive ? 'Bloquear usuario' : 'Desbloquear usuario'}
                  icon={isActive ? 'times' : 'check'}
                  variant={isActive ? 'danger' : 'success'}
                  onPress={() => onToggle(row.id)}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // ─── VISTA MÓVIL ───
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.mCorreo]}>Correo</Text>
        <Text style={[styles.headerCell, styles.mPlaca]}>Nº placa</Text>
        <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
        <View style={styles.mBtnContainer} />
      </View>
      
      {users.map((row, i) => {
        const isActive = row.estado === 'Activo';
        
        return (
          <View key={row.id} style={rowStyle(i)}>
            <Text style={[styles.cell, styles.mCorreo]} numberOfLines={1}>
              {row.correo}
            </Text>
            <Text style={[styles.cell, styles.mPlaca]}>{row.numeroPlaca}</Text>
            <Text style={[styles.cell, styles.mEstado]}>{row.estado}</Text>
            
            <View style={styles.mBtnContainer}>
              <Button
                icon={isActive ? 'times' : 'check'}
                variant={isActive ? 'danger' : 'success'}
                onPress={() => onToggle(row.id)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({ 
  table: { 
    borderRadius: 8, 
    overflow: 'hidden', 
    backgroundColor: '#fff',
  },
  headerRow: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.tableHeaderBackground || '#000', 
    paddingVertical: 10, // REDUCIDO: Antes era 12, ahora la cabecera es más fina
    alignItems: 'center' 
  },
  headerCell: { 
    flex: 1, 
    ...theme.typography.body, 
    color: theme.colors.tableHeaderText || '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 14,
  },
  headerBtnSpace: {
    flex: 1.5, 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  rowEven: { backgroundColor: theme.colors.tableRowEven || '#f0f0f0' },
  rowOdd:  { backgroundColor: theme.colors.tableRowOdd || '#e6e6e6' },
  
  cell: { 
    flex: 1, 
    textAlign: 'center', 
    ...theme.typography.body, 
    color: theme.colors.tableText || '#333', 
    fontSize: 13,
  },
  
  // ── Ajustes específicos de Escritorio ──
  desktopCorreo: {
    flex: 2,
    textAlign: 'left', // Alinea el texto a la izquierda
    paddingLeft: 24,   // Da un respiro desde el borde izquierdo
  },
  actionCell: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ── Ajustes específicos de Móvil ──
  mCorreo: { 
    flex: 2, 
    textAlign: 'left', 
    paddingLeft: 12, // Respiro desde el borde izquierdo en móvil
    fontSize: 11 
  },
  mPlaca: { flex: 1, fontSize: 11 },
  mEstado: { flex: 1.2, fontSize: 11 },
  mBtnContainer: { 
    width: 50, // Un poco más de ancho para acomodar el padding
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingRight: 16, // AÑADIDO: Despega el botón del borde derecho en móvil
  },
});