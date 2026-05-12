import React, { useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet, RefreshControl, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useScroll } from '../../context/ScrollContext';
import { Container } from '../../components/layout/Container';
import { UsersTable } from './tables/UsersTable';
import EmptyState from '../../components/ui/EmptyState';
import TableSkeleton from '../../components/ui/TableSkeleton';
import AppSnackbar from '../../components/ui/AppSnackBar';
import FadeInView from '../../components/animations/FadeInView';
import { API_URL } from '../../config/env';

import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import ToggleButton from '../../components/ui/ToggleButton';
import FilterPopover from '../../components/ui/FilterPopover';
import { UseUsuariosFilter, ORDER_OPTIONS, STATUS_OPTIONS } from './filters/UseUsuariosFilter';
import SummaryCards from '../../components/ui/SummaryCards';

export function AdminUsuariosScreen() {
  const { user } = useAuth();
  const { handleScroll } = useScroll();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

  const {
    filteredData,
    roleOptions,
    order, setOrder,
    statusFilter, setStatusFilter,
    roleFilter, setRoleFilter,
    emailSearch, setEmailSearch,
    numFiltrosActivos,
    resetFilters,
  } = UseUsuariosFilter(users);

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  const showSnackbar = (message, variant = 'normal') =>
    setSnackbar({ visible: true, message, variant });

  const hideSnackbar = () =>
    setSnackbar(prev => ({ ...prev, visible: false }));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
      setUsers(data.users || []);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const hasData = !loading && users.length > 0;

  return (
    <Container>
      <FadeInView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          >
            <Text style={styles.pageTitle}>Panel de Usuarios</Text>

            {/* ── Summary Cards ── */}
            {hasData && (
              <SummaryCards
                data={[
                  { label: 'Total Usuarios', value: users.length, icon: 'users', color: theme.colors.primary },
                  { label: 'Activos', value: users.filter(u => u.status === 'active').length, icon: 'check-circle', color: '#2ECC71' },
                  { label: 'Bloqueados', value: users.filter(u => u.status !== 'active').length, icon: 'ban', color: '#E74C3C' },
                  { label: 'Policías', value: users.filter(u => u.role === 'police').length, icon: 'shield', color: '#3498DB' },
                ]}
              />
            )}

            {/* ── Barra superior ── */}
            {hasData && (
              <View style={styles.topBar}>
                <View style={{ position: 'relative', overflow: 'visible', marginTop: 6, marginRight: 6 }}>
                  <Button
                    title="Filtrar"
                    icon="filter"
                    variant="primary"
                    onPress={() => setShowFilters(true)}
                  />
                  {numFiltrosActivos > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{numFiltrosActivos}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.orderContainer}>
                  <Text style={styles.orderLabel}>Ordenar por</Text>
                  <Dropdown
                    options={ORDER_OPTIONS}
                    selected={order}
                    onSelect={setOrder}
                    placeholder="Ordenar por..."
                  />
                </View>
              </View>
            )}

            {/* ── Buscador de correo ── */}
            {hasData && (
              <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                  <Ionicons name="search-outline" size={16} color={theme.colors.text} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por correo..."
                    placeholderTextColor={theme.colors.text}
                    value={emailSearch}
                    onChangeText={setEmailSearch}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {emailSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setEmailSearch('')} hitSlop={8}>
                      <Ionicons name="close" size={16} color={theme.colors.text} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {loading && !refreshing ? (
              <TableSkeleton rows={6} cols={4} />
            ) : users.length === 0 ? (
              <EmptyState
                icon="users-slash"
                title="No hay usuarios registrados"
                subtitle="Tira hacia abajo para refrescar."
                buttonText="Recargar"
                onButtonPress={fetchUsers}
              />
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon="search-minus"
                title="No se encontraron usuarios"
                subtitle="Prueba ajustando los filtros para ver más resultados."
                buttonText="Limpiar filtros"
                onButtonPress={resetFilters}
              />
            ) : (
              <>
                <Text style={styles.resultsText}>
                  {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''}
                </Text>
                <UsersTable users={filteredData} />
              </>
            )}

          </ScrollView>
        </View>
      </FadeInView>

      {/* ── Modal de filtros ── */}
      <FilterPopover visible={showFilters} onClose={() => setShowFilters(false)}>

        <Text style={styles.filterGroupTitle}>Estado</Text>
        <View style={styles.toggleGroup}>
          {STATUS_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={statusFilter?.value === opt.value}
              onToggle={(val) => setStatusFilter(val ? opt : null)}
            />
          ))}
        </View>

        <Text style={styles.filterGroupTitle}>Rol</Text>
        <View style={styles.toggleGroup}>
          {roleOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              title={opt.label}
              selected={roleFilter?.value === opt.value}
              onToggle={(val) => setRoleFilter(val ? opt : null)}
            />
          ))}
        </View>

      </FilterPopover>

      <AppSnackbar
        visible={snackbar.visible}
        message={snackbar.message}
        variant={snackbar.variant}
        onDismiss={hideSnackbar}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 1000, alignSelf: 'center' },
  pageTitle: { ...theme.typography.pageTitle, color: theme.colors.text, textAlign: 'center', marginBottom: 24, marginTop: 20 },
  topBar: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 25, marginBottom: 20 },
  orderContainer: { width: 320 },
  orderLabel: { ...theme.typography.body, color: theme.colors.text, marginBottom: 4 },
  searchRow: { marginBottom: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.tableBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  resultsText: { ...theme.typography.body, color: theme.colors.text, marginBottom: 8 },
  filterGroupTitle: { ...theme.typography.cardTitle, color: theme.colors.cardText, marginBottom: 8, marginTop: 18 },
  toggleGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  centerLoader: { marginTop: 60 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: theme.colors.tableBorder,
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  badgeText: {
    color: theme.colors.primaryButtonText,
    fontSize: 10,
    fontWeight: '700',
    includeFontPadding: false,
  },
});