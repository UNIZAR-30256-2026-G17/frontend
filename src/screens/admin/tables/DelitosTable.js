import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../../theme';
import Button from '../../../components/ui/Button';
import TablePagination from '../../../components/ui/TablePagination';
import FadeInView from '../../../components/animations/FadeInView';

const COLS_DESKTOP = [
  { key: 'id', header: 'Id', flex: 1.5 },
  { key: 'tipo', header: 'Tipo de delito', flex: 2 },
  { key: 'fecha', header: 'Fecha', flex: 1.5 },
  { key: 'distrito', header: 'Distrito', flex: 1.5 },
  { key: 'beat', header: 'Beat', flex: 0.8 },
  { key: 'estado', header: 'Estado', flex: 1 },
];

const ITEMS_PER_PAGE = 10;

export function DelitosTable({ delitos = [], onToggle }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);

  const paginatedData = delitos.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(delitos.length / ITEMS_PER_PAGE);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderContent = () => {
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
        onPageChange={setPage}
        totalItems={delitos.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderColor: theme.colors.tableBorder || '#eee',
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableHeaderBackground || '#000',
    paddingVertical: 12,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowEven: { backgroundColor: theme.colors.tableRowEven || '#f0f0f0' },
  rowOdd: { backgroundColor: theme.colors.tableRowOdd || '#e6e6e6' },
  cell: {
    textAlign: 'center',
    ...theme.typography.body,
    color: theme.colors.tableText || '#333',
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
    paddingRight: 8,
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
    borderTopColor: theme.colors.tableBorder || '#eee',
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