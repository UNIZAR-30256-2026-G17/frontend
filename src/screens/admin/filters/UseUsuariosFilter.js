/**
 * @file UseUsuariosFilter.js
 * @description Hook personalizado para la gestión de búsqueda y filtrado de usuarios en el panel administrativo.
 * Soporta búsqueda por email, filtrado por rol dinámico y estado de cuenta.
 */

import { useState, useMemo } from 'react';

export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
];

export const STATUS_OPTIONS = [
  { label: 'Activo',   value: 'active' },
  { label: 'Bloqueado', value: 'blocked' },
];

/**
 * Hook UseUsuariosFilter
 * @param {Array} users - Lista de usuarios del sistema
 */
export function UseUsuariosFilter(users = []) {
  const [order,        setOrder]        = useState(ORDER_OPTIONS[0]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [roleFilter,   setRoleFilter]   = useState(null);
  const [emailSearch, setEmailSearch] = useState('');

  // Genera opciones de roles basadas en los roles existentes en la base de datos
  const roleOptions = useMemo(() => {
    const unique = [...new Set(users.map(u => u.role).filter(Boolean))];
    return unique.map(r => ({ label: r.charAt(0).toUpperCase() + r.slice(1), value: r }));
  }, [users]);

  // Procesa la lista de usuarios según los criterios de búsqueda y filtros
  const filteredData = useMemo(() => {
    return users
      .filter((row) => {
        if (emailSearch && !row.email?.toLowerCase().includes(emailSearch.toLowerCase())) return false;
        if (statusFilter?.value && row.status !== statusFilter.value) return false;
        if (roleFilter?.value   && row.role   !== roleFilter.value)   return false;
        return true;
      })
      .sort((a, b) => {
        if (order?.value === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [order, statusFilter, roleFilter, emailSearch, users]);

  /**
   * Restablece todos los campos de búsqueda y filtros
   */
  const resetFilters = () => {
    setStatusFilter(null);
    setRoleFilter(null);
    setEmailSearch('');
  };

  /**
   * Cuenta los filtros activos para la visualización del badge
   */
  const numFiltrosActivos = [
    statusFilter?.value,
    roleFilter?.value,
    emailSearch || null,
  ].filter(Boolean).length;

  return {
    filteredData,
    roleOptions,
    order,        setOrder,
    statusFilter, setStatusFilter,
    roleFilter,   setRoleFilter,
    emailSearch,  setEmailSearch,
    numFiltrosActivos,
    resetFilters,
  };
}