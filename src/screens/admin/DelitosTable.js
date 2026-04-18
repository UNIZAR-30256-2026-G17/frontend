import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

const COLS_DESKTOP = [
  { key: 'id', header: 'Id', flex: 1.2 },
  { key: 'tipo', header: 'Tipo de delito', flex: 2 },
  { key: 'subtipo', header: 'Subtipo de delito', flex: 1.5 },
  { key: 'fecha', header: 'Fecha', flex: 1 },
  { key: 'hora', header: 'Hora', flex: 0.8 },
  { key: 'distrito', header: 'Distrito', flex: 1.2 },
  { key: 'beat', header: 'Beat', flex: 0.6 },
  { key: 'estado', header: 'Estado', flex: 1 },
];

export function DelitosTable({ delitos, onToggle }) {
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
              ]}
            >
              {col.header}
            </Text>
          ))}
          <View style={styles.headerBtnSpace} /> 
        </View>

        {delitos.map((row, i) => {
          const isDisponible = row.estado === 'Disponible';
          return (
            <View key={row.id} style={rowStyle(i)}>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[0].flex }, styles.desktopLeftAlign, { paddingLeft: 16 }]}>{row.id}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[1].flex }, styles.desktopLeftAlign]} numberOfLines={1}>{row.tipo}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[2].flex }]} numberOfLines={1}>{row.subtipo}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[3].flex }]}>{row.fecha}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[4].flex }]}>{row.hora}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[5].flex }]} numberOfLines={1}>{row.distrito}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[6].flex }]}>{row.beat}</Text>
              <Text style={[styles.cell, { flex: COLS_DESKTOP[7].flex }]}>{row.estado}</Text>
              
              <View style={styles.actionCellDesktop}>
                <Button
                  title={isDisponible ? 'Eliminar' : 'Restaurar'} // En desktop sí lleva texto
                  icon={isDisponible ? 'times' : 'check'}
                  variant={isDisponible ? 'danger' : 'success'}
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

  // ─── VISTA MÓVIL (Acordeón como en la foto) ───
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.mId]}>Id</Text>
        <Text style={[styles.headerCell, styles.mTipo]}>Tipo de delito</Text>
        <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
        <View style={styles.mActionsContainer} /> {/* Espacio para los dos botones */}
      </View>
      
      {delitos.map((row, i) => {
        const expanded = expandedRow === row.id;
        const isDisponible = row.estado === 'Disponible';
        
        return (
          <View key={row.id}>
            <View style={rowStyle(i)}>
              <Text style={[styles.cell, styles.mId]} numberOfLines={1}>{row.id}</Text>
              <Text style={[styles.cell, styles.mTipo]} numberOfLines={1}>{row.tipo}</Text>
              <Text style={[styles.cell, styles.mEstado]}>{row.estado}</Text>
              
              {/* Contenedor con los dos iconos alineados a la derecha */}
              <View style={styles.mActionsContainer}>
                <Button
                  // ¡SIN TITLE! Para que tu Button.js lo detecte como isIconOnly y lo haga circular
                  icon={isDisponible ? 'times' : 'check'}
                  variant={isDisponible ? 'danger' : 'success'}
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
            
            {/* Detalles desplegables (Solo texto, como en la foto) */}
            {expanded && (
              <View style={[styles.expandedRow, i % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                <Text style={styles.expText}><Text style={styles.expLabel}>Subtipo de delito: </Text>{row.subtipo}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Fecha: </Text>{row.fecha}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Hora: </Text>{row.hora}</Text>
                <Text style={styles.expText}><Text style={styles.expLabel}>Distrito: </Text>{row.distrito}</Text>
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
  
  // ── Ajustes específicos de Escritorio ──
  actionCellDesktop: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  
  // ── Ajustes específicos de Móvil ──
  mId: { flex: 1.2, textAlign: 'left', paddingLeft: 12, fontSize: 11 },
  mTipo: { flex: 1.8, textAlign: 'left', fontSize: 11 },
  mEstado: { flex: 1.2, fontSize: 11 },
  mActionsContainer: { 
    width: 75, // Ancho fijo para acomodar los dos iconos redondos
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-end',
    paddingRight: 12,
    gap: 6, // Separación entre la cruz/check y el símbolo de (+)
  },
  expandButton: {
    padding: 4, // Pequeño padding para facilitar el tap
  },
  
  // ── Estilos del Acordeón (Móvil) ──
  expandedRow: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#ccc', 
    gap: 4 // Un gap más pequeño para que parezca una lista continua
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