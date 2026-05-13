/**
 * @file UsersTable.js
 * @description Componente de tabla para mostrar la lista de usuarios con paginación y acciones.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../../theme';
import Button from '../../../components/ui/Button';
import TablePagination from '../../../components/ui/TablePagination';
import FadeInView from '../../../components/animations/FadeInView';

// Configuración de columnas para escritorio
const COLS_DESKTOP = [
  { key: 'email', header: 'Correo' },
  { key: 'badge_number', header: 'Número de placa' },
  { key: 'role', header: 'Rol' },
  { key: 'status', header: 'Estado' },
];

const ITEMS_PER_PAGE = 10;

/**
 * Componente UsersTable
 * @param {Array} users - Lista de usuarios
 * @param {Function} onToggleStatus - Función para cambiar el estado del usuario
 */
export function UsersTable({ users = [], onToggleStatus }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [page, setPage] = useState(0);

  // Lógica de paginación
  const paginatedData = users.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const numberOfPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  /**
   * Determina el estilo de la fila según si es par o impar
   * @param {Number} i - Índice de la fila
   */
  const rowStyle = (i) => [styles.row, i % 2 === 0 ? styles.rowEven : styles.rowOdd];

  /**
   * Renderiza el contenido de la tabla (desktop o móvil)
   */
  const renderContent = () => {
    if (!isMobile) {
      return (
        <>
          <View style={styles.headerRow}>
            {COLS_DESKTOP.map((col) => (
              <Text
                key={col.key}
                style={[styles.headerCell, col.key === 'email' && styles.colEmail]}
              >
                {col.header}
              </Text>
            ))}
            <View style={styles.headerBtnSpace} />
          </View>

          {paginatedData.map((row, i) => (
            <FadeInView key={row._id} delay={i * 50} translateY={10}>
              <View style={rowStyle(i)}>
                <Text style={[styles.cell, styles.colEmail]}>{row.email}</Text>
                <Text style={styles.cell}>{row.badge_number ?? '—'}</Text>
                <Text style={styles.cell}>{row.role}</Text>
                <Text style={styles.cell}>
                  {row.status === 'active' ? 'Activo' : 'Bloqueado'}
                </Text>
                <View style={styles.actionCell}>
                  <Button
                    title={row.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                    icon={row.status === 'active' ? 'times' : 'check'}
                    variant={row.status === 'active' ? 'danger' : 'success'}
                    size="small"
                    onPress={() => onToggleStatus && onToggleStatus(row._id, row.status)}
                  />
                </View>
              </View>
            </FadeInView>
          ))}
        </>
      );
    }

    // Renderizado móvil
    return (
      <>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.mCorreo]}>Correo</Text>
          <Text style={[styles.headerCell, styles.mPlaca]}>Nº placa</Text>
          <Text style={[styles.headerCell, styles.mEstado]}>Estado</Text>
          <View style={{ width: 50 }} />
        </View>

        {paginatedData.map((row, i) => (
          <FadeInView key={row._id} delay={i * 40} translateY={8}>
            <View style={rowStyle(i)}>
              <Text style={[styles.cell, styles.mCorreo]} numberOfLines={1}>
                {row.email}
              </Text>
              <Text style={[styles.cell, styles.mPlaca]}>
                {row.badge_number ?? '—'}
              </Text>
              <Text style={[styles.cell, styles.mEstado]}>
                {row.status === 'active' ? 'Activo' : 'Bloqueado'}
              </Text>
              <View style={styles.mBtnContainer}>
                <Button
                  icon={row.status === 'active' ? 'times' : 'check'}
                  variant={row.status === 'active' ? 'danger' : 'success'}
                  size="small"
                  onPress={() => onToggleStatus && onToggleStatus(row._id, row.status)}
                />
              </View>
            </View>
          </FadeInView>
        ))}
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
        totalItems={users.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.tableBorder || '#eee',
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableHeaderBackground || '#000',
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    color: theme.colors.tableHeaderText || '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowEven: { backgroundColor: theme.colors.tableRowEven || '#fff' },
  rowOdd: { backgroundColor: theme.colors.tableRowOdd || '#f9f9f9' },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.tableText || '#333',
    fontSize: 13,
    paddingVertical: 10,
  },
  headerBtnSpace: { flex: 1.2 },
  actionCell: { flex: 1.2, alignItems: 'center', justifyContent: 'center', paddingRight: theme.spacing.sm },
  colEmail: { flex: 2, textAlign: 'left', paddingLeft: theme.spacing.xl },
  mCorreo: { flex: 2, textAlign: 'left', paddingLeft: theme.spacing.md, fontSize: 11 },
  mPlaca: { flex: 1, fontSize: 11 },
  mEstado: { flex: 1.2, fontSize: 11 },
  mBtnContainer: { width: 50, alignItems: 'center', justifyContent: 'center', paddingRight: theme.spacing.lg },
});