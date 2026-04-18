import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

const COLS_DESKTOP = [
  { key: 'id', header: '#', flex: 0.5 },
  { key: 'descripcion', header: 'Descripción', flex: 2.2 },
  { key: 'direccion', header: 'Dirección', flex: 2.5 },
  { key: 'fecha', header: 'Fecha', flex: 1 },
  { key: 'confirmaciones', header: 'Confirm...', flex: 0.8 }, // Truncado como en tu foto
  { key: 'descartes', header: 'Descartes', flex: 0.8 },
  { key: 'estado', header: 'Estado', flex: 1 },
];

export function AlertasTable({ alertas, onToggle }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 900; 
  const [expandedRow, setExpandedRow] = useState(null);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  // ─── VISTA DESKTOP ───
  if (!isMobile) {
    return (
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {COLS_DESKTOP.map((col) => (
            <Text 
              key={col.key} 
              style={[
                styles.headerCell, 
                { flex: col.flex },
                (col.key === 'id' || col.key === 'descripcion' || col.key === 'direccion') && styles.desktopLeftAlign,
                col.key === 'id' && { paddingLeft: 16 }
              ]}
            >
              {col.header}
            </Text>
          ))}
          <View style={styles.headerBtnSpace} /> 
        </View>

        {alertas.map((row, i) => {
          const isEliminada = row.estado === 'Eliminada';
          return (
            <View key={row.id} style={rowStyle(i)}>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[0].flex }, styles.desktopLeftAlign, { paddingLeft: 16 }]}>{row.id}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[1].flex }, styles.desktopLeftAlign]} numberOfLines={1}>{row.descripcion}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[2].flex }, styles.desktopLeftAlign]} numberOfLines={1}>{row.direccion}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[3].flex }]}>{row.fecha}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[4].flex }]}>{row.confirmaciones}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[5].flex }]}>{row.descartes}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[6].flex }]}>{row.estado}</Text>
              
              <View style={styles.actionCellDesktop}>
                <Button
                  title={isEliminada ? 'Restaurar' : 'Eliminar'} 
                  icon={isEliminada ? 'check' : 'times'}
                  variant={isEliminada ? 'success' : 'danger'}
                  size="small"
                  onPress={() => onToggle(row.id)}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // ─── VISTA MÓVIL (Acordeón) ───
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.mId]}>#</Text>
        <Text style={[styles.headerCell, styles.mDesc]}>Descripción</Text>
        <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
        <View style={styles.mActionsContainer} /> 
      </View>
      
      {alertas.map((row, i) => {
        const expanded = expandedRow === row.id;
        const isEliminada = row.estado === 'Eliminada';
        
        return (
          <View key={row.id}>
            <View style={rowStyle(i)}>
              <Text style={[styles.cell, styles.mId]} numberOfLines={1}>{row.id}</Text>
              <Text style={[styles.cell, styles.mDesc]} numberOfLines={1}>{row.descripcion}</Text>
              <Text style={[styles.cell, styles.mEstado]}>{row.estado}</Text>
              
              <View style={styles.mActionsContainer}>
                <Button
                  icon={isEliminada ? 'check' : 'times'}
                  variant={isEliminada ? 'success' : 'danger'}
                  size="small"
                  onPress={() => onToggle(row.id)}
                />
                
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedRow(expanded ? null : row.id)}
                >
                  <FontAwesome
                    name={expanded ? 'minus-circle' : 'plus-circle'}
                    size={22}
                    color={theme.colors.tableText || '#333'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {expanded && (
              <View style={[styles.expandedRow, i % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                <Text style={styles.expText}><Text style={styles.expLabel}>Dirección: </Text>{row.direccion}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Fecha: </Text>{row.fecha}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Confirmaciones: </Text>{row.confirmaciones}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Descartes: </Text>{row.descartes}</Text>
              </View>
            )}
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
    paddingVertical: 10, 
    alignItems: 'center' 
  },
  headerCell: { 
    ...theme.typography.body, 
    color: theme.colors.tableHeaderText || '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 12, 
  },
  headerBtnSpace: {
    flex: 1.2, 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowEven: { backgroundColor: theme.colors.tableRowEven || '#f0f0f0' },
  rowOdd:  { backgroundColor: theme.colors.tableRowOdd || '#e6e6e6' },
  
  cell: { 
    textAlign: 'center', 
    ...theme.typography.body, 
    color: theme.colors.tableText || '#333', 
    fontSize: 12,
  },
  
  // ── Ajustes Escritorio ──
  desktopLeftAlign: {
    textAlign: 'left',
  },
  actionCellDesktop: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  
  // ── Ajustes Móvil ──
  mId: { flex: 0.6, textAlign: 'left', paddingLeft: 12, fontSize: 11 },
  mDesc: { flex: 2.4, textAlign: 'left', fontSize: 11 },
  mEstado: { flex: 1.2, fontSize: 11 },
  mActionsContainer: { 
    width: 75, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-end',
    paddingRight: 12,
    gap: 6, 
  },
  expandButton: {
    padding: 4, 
  },
  
  // ── Acordeón (Móvil) ──
  expandedRow: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#ccc', 
    gap: 4 
  },
  expText: { 
    ...theme.typography.body, 
    color: theme.colors.tableText || '#333',
    fontSize: 12,
  },
  expLabel: { 
    fontWeight: 'bold', 
  },
});