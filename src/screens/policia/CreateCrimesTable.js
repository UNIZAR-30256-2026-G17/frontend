import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useWindowDimensions } from 'react-native';
import TablePagination from '../../components/ui/TablePagination';

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

export function CreateCrimesTable({ data }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);

  const paginatedData = data.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  const renderTableContent = () => {
    if (!isMobile) {
      return (
        <>
          <View style={styles.headerRow}>
            {COLS.map((col) => (
              <Text key={col.key} style={styles.headerCell}>{col.header}</Text>
            ))}
          </View>
          {paginatedData.map((row, i) => (
            <View key={row.id} style={rowStyle(i)}>
              {COLS.map((col) => (
                <Text key={col.key} style={styles.cell}>{row[col.key]}</Text>
              ))}
            </View>
          ))}
        </>
      );
    }

    // Vista Móvil
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
            <View key={row.id}>
              <View style={rowStyle(i)}>
                <Text style={[styles.cell, styles.mId]}>{row.id}</Text>
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
      borderRadius: 10, 
      overflow: 'hidden', 
      borderColor: theme.colors.tableBorder, 
      borderWidth: 1
    },
    headerRow: { 
      flexDirection: 'row', 
      backgroundColor: theme.colors.tableHeaderBackground, 
      paddingVertical: 12, 
      alignItems: 'center' 
    },
    headerCell: { 
      flex: 1, 
      ...theme.typography.body, 
      color: theme.colors.tableHeaderText, 
      fontWeight: 'bold', 
      textAlign: 'center' 
    },
    row: { 
      flexDirection: 'row', 
      borderTopWidth: 1, 
      borderTopColor: theme.colors.tableBorder, 
      paddingVertical: 10, 
      alignItems: 'center' 
    },
    rowEven: { backgroundColor: theme.colors.tableRowEven },
    rowOdd:  { backgroundColor: theme.colors.tableRowOdd },
    cell: { 
      flex: 1, 
      textAlign: 'center', 
      ...theme.typography.body, 
      color: theme.colors.tableText 
    },
    
    mId: { 
      flex: 1.2, 
      fontSize: 12 
    },
    mTipo: { flex: 2 },
    mSubtipo: { flex: 1.5 },
    mBtn: { width: 32, alignItems: 'center' },
    
    expandedRow: { 
      paddingHorizontal: 16, 
      paddingVertical: 10, 
      borderTopWidth: 1, 
      borderTopColor: theme.colors.tableBorder, 
      gap: 4 
    },
    expText: { 
      ...theme.typography.body, 
      color: theme.colors.tableText 
    },
    expLabel: { 
      fontWeight: 'bold', 
      color: theme.colors.tableText 
    },
});