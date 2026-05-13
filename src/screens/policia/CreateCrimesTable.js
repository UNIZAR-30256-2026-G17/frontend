/**
 * @file CreateCrimesTable.js
 * @description Componente de tabla para la visualización del listado de delitos.
 * Implementa un diseño responsivo con expansión de filas en dispositivos móviles.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import TablePagination from '../../components/ui/TablePagination';
import FadeInView from '../../components/animations/FadeInView';

const COLS = [
  { header: 'Id',             key: 'id' },
  { header: 'Tipo de delito', key: 'tipo' },
  { header: 'Subtipo',        key: 'subtipo' },
  { header: 'Fecha',          key: 'fecha' },
  { header: 'Hora',           key: 'hora' },
  { header: 'Distrito',       key: 'distrito' },
  { header: 'Beat',           key: 'beat' },
  { header: 'Sector',         key: 'sector' },
];

const EXPANDED_KEYS = ['fecha', 'hora', 'distrito', 'beat', 'sector'];
const ITEMS_PER_PAGE = 10;

/**
 * Componente CreateCrimesTable
 * @param {Array} data - Lista de delitos a mostrar
 */
export function CreateCrimesTable({ data }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);

  // Lógica de paginación en el cliente
  const paginatedData = data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  /**
   * Renderiza el contenido de la tabla según el tamaño de la pantalla
   */
  const renderTableContent = () => {
    // ── Vista de Escritorio ──
    if (!isMobile) {
      return (
        <>
          <View style={styles.headerRow}>
            {COLS.map((col) => (
              <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
            ))}
          </View>
          {paginatedData.map((row, i) => (
            <FadeInView key={row.id} delay={i * 50} translateY={10}>
              <View style={rowStyle(i)}>
                {COLS.map((col) => (
                  <Text key={col.key} style={[styles.cell, col.key === 'id' && styles.monoCell]}>
                    {row[col.key]}
                  </Text>
                ))}
              </View>
            </FadeInView>
          ))}
        </>
      );
    }

    // ── Vista Móvil (Compacta con expansión) ──
    return (
      <>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.mId]}>Id</Text>
          <Text style={[styles.headerCell, styles.mTipo]}>Tipo</Text>
          <Text style={[styles.headerCell, styles.mSubtipo]}>Subtipo</Text>
          <View style={styles.mBtn} />
        </View>
        {paginatedData.map((row, i) => {
          const expanded = expandedRow === row.id;
          return (
            <FadeInView key={row.id} delay={i * 40} translateY={8}>
              <View>
                <View style={rowStyle(i)}>
                  <Text style={[styles.cell, styles.monoCell, styles.mId]}>{row.id}</Text>
                  <Text style={[styles.cell, styles.mTipo]}>{row.tipo}</Text>
                  <Text style={[styles.cell, styles.mSubtipo]}>{row.subtipo}</Text>
                  <TouchableOpacity
                    style={styles.mBtn}
                    onPress={() => setExpandedRow(expanded ? null : row.id)}
                  >
                    <FontAwesome
                      name={expanded ? 'minus-circle' : 'plus-circle'}
                      size={18}
                      color={theme.colors.tableText}
                    />
                  </TouchableOpacity>
                </View>
                {expanded && (
                  <View style={[styles.expandedRow, i % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                    {EXPANDED_KEYS.map((key) => (
                      <Text key={key} style={styles.expText}>
                        <Text style={styles.expLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}: </Text>
                        {row[key]}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </FadeInView>
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.table}>
      {renderTableContent()}
      <TablePagination
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={setPage}
        totalItems={data.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </View>
  );
}

const styles = StyleSheet.create({ 
    table: { 
      borderRadius: theme.radii.lg, 
      overflow: 'hidden', 
      borderColor: theme.colors.tableBorder, 
      borderWidth: 1,
      backgroundColor: theme.colors.cardBackground
    },
    headerRow: { 
      flexDirection: 'row', 
      backgroundColor: theme.colors.tableHeaderBackground, 
      paddingVertical: theme.spacing.md, 
      alignItems: 'center' 
    },
    headerCell: { 
      flex: 1, 
      ...theme.typography.bodyBold, 
      color: theme.colors.tableHeaderText, 
      textAlign: 'center',
      fontSize: 13
    },
    row: { 
      flexDirection: 'row', 
      borderBottomWidth: 1, 
      borderBottomColor: 'rgba(255,255,255,0.05)', 
      paddingVertical: theme.spacing.md, 
      alignItems: 'center' 
    },
    rowEven: { backgroundColor: theme.colors.tableRowEven },
    rowOdd:  { backgroundColor: theme.colors.tableRowOdd },
    cell: { 
      flex: 1, 
      textAlign: 'center', 
      ...theme.typography.body, 
      color: theme.colors.tableText,
      fontSize: 12
    },
    monoCell: {
      ...theme.typography.mono,
      fontSize: 11,
    },
    
    mId: { 
      flex: 1.2, 
      fontSize: 11 
    },
    mTipo: { flex: 2, fontSize: 11 },
    mSubtipo: { flex: 1.5, fontSize: 11 },
    mBtn: { width: 32, alignItems: 'center' },
    
    expandedRow: { 
      paddingHorizontal: theme.spacing.xl, 
      paddingVertical: theme.spacing.md, 
      borderTopWidth: 1, 
      borderTopColor: theme.colors.tableBorder, 
      gap: 4 
    },
    expText: { 
      ...theme.typography.body, 
      color: theme.colors.tableText,
      fontSize: 12
    },
    expLabel: { 
      ...theme.typography.bodyBold,
      color: theme.colors.tableText,
      fontSize: 12
    },
});