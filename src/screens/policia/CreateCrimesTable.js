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
  { header: 'Id', key: '_id' },
  { header: 'Tipo de delito', key: 'crimename1' },
  { header: 'Subtipo', key: 'crimename2' },
  { header: 'Fecha', key: 'start_date' },
  { header: 'Distrito', key: 'district' },
  { header: 'Beat', key: 'beat' },
];

const ITEMS_PER_PAGE = 10;

/**
 * Componente CreateCrimesTable
 * @param {Array} data - Lista de delitos a mostrar
 */
export default function CreateCrimesTable({ data = [], onLoadMore }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);

  // Lógica de paginación en el cliente
  const paginatedData = data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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
            <FadeInView key={row._id} delay={i * 50} translateY={10}>
              <View style={rowStyle(i)}>
                <Text style={[styles.cell, styles.monoCell]}>{row._id}</Text>
                <Text style={styles.cell}>{row.crimename1}</Text>
                <Text style={styles.cell}>{row.crimename2}</Text>
                <Text style={styles.cell}>{formatDate(row.start_date)}</Text>
                <Text style={styles.cell}>{row.district}</Text>
                <Text style={styles.cell}>{row.beat}</Text>
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
          const expanded = expandedRow === row._id;
          return (
            <FadeInView key={row._id} delay={i * 40} translateY={8}>
              <View>
                <View style={rowStyle(i)}>
                  <Text style={[styles.cell, styles.monoCell, styles.mId]} numberOfLines={1}>{row._id}</Text>
                  <Text style={[styles.cell, styles.mTipo]} numberOfLines={1}>{row.crimename1}</Text>
                  <Text style={[styles.cell, styles.mSubtipo]} numberOfLines={1}>{row.crimename2}</Text>
                  <TouchableOpacity
                    style={styles.mBtn}
                    onPress={() => setExpandedRow(expanded ? null : row._id)}
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
                    <Text style={styles.expText}><Text style={styles.expLabel}>Fecha: </Text>{formatDate(row.start_date)}</Text>
                    <Text style={styles.expText}><Text style={styles.expLabel}>Distrito: </Text>{row.district}</Text>
                    <Text style={styles.expText}><Text style={styles.expLabel}>Beat: </Text>{row.beat}</Text>
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
        onPageChange={(newPage) => {
          setPage(newPage);
          if (onLoadMore && newPage >= numberOfPages - 2) {
            onLoadMore();
          }
        }}
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
  rowOdd: { backgroundColor: theme.colors.tableRowOdd },
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
