/**
 * @file DelitosTable.js
 * @description Componente de tabla responsiva para la visualización del catálogo de delitos en el panel de administración.
 * Soporta paginación, estados expandibles en móvil y acciones de habilitación/deshabilitación.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../../theme';
import Button from '../../../components/ui/Button';
import TablePagination from '../../../components/ui/TablePagination';
import FadeInView from '../../../components/animations/FadeInView';

// Definición de columnas para la vista de escritorio
const COLS_DESKTOP = [
  { key: 'id', header: 'Id', flex: 1.5 },
  { key: 'tipo', header: 'Tipo de delito', flex: 2 },
  { key: 'fecha', header: 'Fecha', flex: 1.5 },
  { key: 'distrito', header: 'Distrito', flex: 1.5 },
  { key: 'beat', header: 'Beat', flex: 0.8 },
  { key: 'estado', header: 'Estado', flex: 1 },
];

const ITEMS_PER_PAGE = 10;

/**
 * Componente DelitosTable
 */
export function DelitosTable({ delitos = [], onToggle, onLoadMore }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);

  // Lógica de paginación
  const paginatedData = delitos.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(delitos.length / ITEMS_PER_PAGE);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  /**
   * Formatea una cadena de fecha a formato local
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  /**
   * Renderiza el contenido de la tabla basándose en el ancho de la pantalla
   */
  const renderContent = () => {
    // ── Vista de Escritorio ──
    if (!isMobile) {
      return (
        <>
          <View style={styles.headerRow}>
            {COLS_DESKTOP.map((col) => (
              <Text key={col.key} style={[styles.headerCell, { flex: col.flex }]}>
                {col.header}
              </Text>
            ))}
            <View style={styles.headerBtnSpace} />
          </View>

          {paginatedData.map((row, i) => {
            const isDisponible = row.status === 'available';
            const statusText = isDisponible ? 'Disponible' : 'Eliminado';

            return (
              <FadeInView key={row._id} delay={i * 50} translateY={10}>
                <View style={rowStyle(i)}>
                  <Text style={[styles.cell, styles.monoCell, { flex: COLS_DESKTOP[0].flex }]} numberOfLines={1}>{row._id}</Text>
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
              </FadeInView>
            );
          })}
        </>
      );
    }

    // ── Vista Móvil ──
    return (
      <>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.mId]}>Id</Text>
          <Text style={[styles.headerCell, styles.mTipo]}>Tipo de delito</Text>
          <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
          <View style={styles.mActionsContainer} />
        </View>

        {paginatedData.map((row, i) => {
          const expanded = expandedRow === row._id;
          const isDisponible = row.status === 'available';
          const statusText = isDisponible ? 'Disponible' : 'Eliminado';

          return (
            <FadeInView key={row._id} delay={i * 40} translateY={8}>
              <View>
                <View style={rowStyle(i)}>
                  <Text style={[styles.cell, styles.monoCell, styles.mId]} numberOfLines={1}>{row._id}</Text>
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
            </FadeInView>
          );
        })}
      </>
    );
  };

  return (
    <View style={styles.table}>
      {renderContent()}
      <TablePagination
        page={page}
        numberOfPages={numberOfPages}
        onPageChange={(newPage) => {
          setPage(newPage);
          if (onLoadMore && newPage >= numberOfPages - 2) {
            onLoadMore();
          }
        }}
        totalItems={delitos.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.tableBorder,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableHeaderBackground,
    paddingVertical: theme.spacing.md,
    alignItems: 'center'
  },
  headerCell: {
    ...theme.typography.body,
    color: theme.colors.tableHeaderText,
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
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowEven: { backgroundColor: theme.colors.tableRowEven },
  rowOdd: { backgroundColor: theme.colors.tableRowOdd },
  cell: {
    textAlign: 'center',
    ...theme.typography.body,
    color: theme.colors.tableText,
    fontSize: 12,
  },
  monoCell: {
    ...theme.typography.mono,
    fontSize: 11,
  },
  actionCellDesktop: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: theme.spacing.sm,
  },
  mId: { flex: 1.2, textAlign: 'left', paddingLeft: theme.spacing.md, fontSize: 11 },
  mTipo: { flex: 1.8, textAlign: 'left', fontSize: 11 },
  mEstado: { flex: 1.2, fontSize: 11 },
  mActionsContainer: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing.md,
    gap: 6,
  },
  expandButton: {
    padding: 4,
  },
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
    fontSize: 12,
  },
  expLabel: {
    ...theme.typography.bodyBold,
    fontSize: 12,
  },
});