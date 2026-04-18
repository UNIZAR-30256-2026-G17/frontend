import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

// Ajustamos los nombres de las columnas para la vista desktop si quieres
const COLS_DESKTOP = [
  { key: 'id', header: 'Id', flex: 1.5 }, // Le subí un poco el flex para que quepa el ID largo
  { key: 'tipo', header: 'Tipo de delito', flex: 2 },
  { key: 'fecha', header: 'Fecha', flex: 1.5 },
  { key: 'distrito', header: 'Distrito', flex: 1.5 },
  { key: 'beat', header: 'Beat', flex: 0.8 },
  { key: 'estado', header: 'Estado', flex: 1 },
];

export function DelitosTable({ delitos = [], onToggle }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 900; 
  const [expandedRow, setExpandedRow] = useState(null);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  // Helper para formatear la fecha que viene del backend
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
              ]}
            >
              {col.header}
            </Text>
          ))}
          <View style={styles.headerBtnSpace} /> 
        </View>

        {delitos?.map((row, i) => {
          const isDisponible = row.status === 'available';
          const statusText = isDisponible ? 'Disponible' : 'Eliminado';

          return (
            <View key={row._id} style={rowStyle(i)}>
              {/* Mostramos el _id completo. Le ponemos numberOfLines={1} por si la pantalla es muy pequeña */}
              <Text style={[styles.cell, { flex: COLS_DESKTOP[0].flex }]} numberOfLines={1}>{row._id}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[1].flex }]} numberOfLines={1}>{row.crimename1}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[2].flex }]}>{formatDate(row.start_date)}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[3].flex }]} numberOfLines={1}>{row.district}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[4].flex }]}>{row.beat}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[5].flex }]}>{statusText}</Text>
              
              <View style={styles.actionCellDesktop}>
                <Button
                  title={isDisponible ? 'Eliminar' : 'Restaurar'}
                  icon={isDisponible ? 'times' : 'check'}
                  variant={isDisponible ? 'danger' : 'success'}
                  size="small"
                  onPress={() => onToggle(row._id, row.status)}
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
        <Text style={[styles.headerCell, styles.mId]}>Id</Text>
        <Text style={[styles.headerCell, styles.mTipo]}>Tipo de delito</Text>
        <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
        <View style={styles.mActionsContainer} />
      </View>
      
      {delitos?.map((row, i) => {
        const expanded = expandedRow === row._id;
        const isDisponible = row.status === 'available';
        const statusText = isDisponible ? 'Disponible' : 'Eliminado';
        
        return (
          <View key={row._id}>
            <View style={rowStyle(i)}>
              {/* Aquí también mostramos el _id completo */}
              <Text style={[styles.cell, styles.mId]} numberOfLines={1}>{row._id}</Text>
              <Text style={[styles.cell, styles.mTipo]} numberOfLines={1}>{row.crimename1}</Text>
              <Text style={[styles.cell, styles.mEstado]}>{statusText}</Text>
              
              <View style={styles.mActionsContainer}>
                <Button
                  icon={isDisponible ? 'times' : 'check'}
                  variant={isDisponible ? 'danger' : 'success'}
                  size="small"
                  onPress={() => onToggle(row._id, row.status)}
                />
                
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => setExpandedRow(expanded ? null : row._id)}
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
                <Text style={styles.expText}><Text style={styles.expLabel}>Fecha: </Text>{formatDate(row.start_date)}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Distrito: </Text>{row.district}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Beat: </Text>{row.beat}</Text>
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
  
  actionCellDesktop: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  desktopLeftAlign: {
    textAlign: 'left'
  },
  
  mId: { flex: 1.2, textAlign: 'left', paddingLeft: 12, fontSize: 11 },
  mTipo: { flex: 1.8, textAlign: 'left', fontSize: 11 },
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