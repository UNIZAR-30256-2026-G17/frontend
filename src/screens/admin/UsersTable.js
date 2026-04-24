import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../theme';
import Button from '../../components/ui/Button'; // ← sin llaves

const COLS_DESKTOP = [
  { key: 'email', header: 'Correo' },
  { key: 'badge_number', header: 'Número de placa' },
  { key: 'role', header: 'Rol' },
  { key: 'status', header: 'Estado' },
];

export function UsersTable({ users }) {
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
              style={[styles.headerCell, col.key === 'email' && styles.colEmail]}
            >
              {col.header}
            </Text>
          ))}
          <View style={styles.headerBtnSpace} />
        </View>

        {users.map((row, i) => (
          <View key={row._id} style={rowStyle(i)}>
            <Text style={[styles.cell, styles.colEmail]}>{row.email}</Text>
            <Text style={styles.cell}>{row.badge_number ?? '—'}</Text>
            <Text style={styles.cell}>{row.role}</Text>
            <Text style={styles.cell}>
              {row.status === 'active' ? 'Activo' : 'Bloqueado'}
            </Text>
            <View style={styles.actionCell}>
              <Button
                title={row.status === 'active' ? 'Bloquear usuario' : 'Desbloquear usuario'}
                icon={row.status === 'active' ? 'times' : 'check'}
                variant={row.status === 'active' ? 'danger' : 'success'}
                onPress={() => {}}
              />
            </View>
          </View>
        ))}
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
        <View style={{ width: 50 }} />
      </View>

      {users.map((row, i) => (
        <View key={row._id} style={rowStyle(i)}>
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
              onPress={() => {}}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.tableHeaderBackground || '#000',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    color: theme.colors.tableHeaderText || '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowEven: { backgroundColor: theme.colors.tableRowEven || '#f0f0f0' },
  rowOdd:  { backgroundColor: theme.colors.tableRowOdd  || '#e6e6e6' },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: theme.colors.tableText || '#333',
    fontSize: 13,
    paddingVertical: 10,
  },
  headerBtnSpace: { flex: 1.5 },
  actionCell: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },
  colEmail: { flex: 2, textAlign: 'left', paddingLeft: 24 },
  mCorreo:  { flex: 2, textAlign: 'left', paddingLeft: 12, fontSize: 11 },
  mPlaca:   { flex: 1, fontSize: 11 },
  mEstado:  { flex: 1.2, fontSize: 11 },
  mBtnContainer: { width: 50, alignItems: 'center', justifyContent: 'center', paddingRight: 16 },
});