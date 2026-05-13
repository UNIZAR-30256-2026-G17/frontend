/**
 * @file UseAlertasFilter.js
 * @description Hook personalizado para la lógica de filtrado y ordenación de alertas en el panel administrativo.
 * Centraliza los estados de los filtros y el procesamiento de los datos filtrados mediante useMemo.
 */

import { useState, useMemo } from 'react';

export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
];

export const STATUS_OPTIONS = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Eliminada', value: 'deleted' },
];

/**
 * Hook UseAlertasFilter
 * @param {Array} alertas - Lista de alertas original
 */
export function UseAlertasFilter(alertas = []) {
  const [order, setOrder]             = useState(ORDER_OPTIONS[0]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFrom, setDateFrom]       = useState(null);
  const [soloConConfirmaciones, setSoloConConfirmaciones] = useState(false);

  // Procesa los filtros cada vez que cambia un criterio o la lista original
  const filteredData = useMemo(() => {
    return alertas
      .filter((row) => {
        if (statusFilter?.value && row.status !== statusFilter.value) return false;
        if (soloConConfirmaciones && !(row.confirmations?.length > 0))  return false;
        if (dateFrom && new Date(row.createdAt) < dateFrom)             return false;
        return true;
      })
      .sort((a, b) => {
        if (order?.value === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [order, statusFilter, dateFrom, soloConConfirmaciones, alertas]);

  /**
   * Limpia todos los filtros activos volviendo al estado inicial
   */
  const resetFilters = () => {
    setStatusFilter(null);
    setDateFrom(null);
    setSoloConConfirmaciones(false);
  };

  /**
   * Calcula cuántos filtros están aplicados actualmente para mostrar el badge
   */
  const numFiltrosActivos = [
    statusFilter?.value,
    dateFrom,
    soloConConfirmaciones || null,
  ].filter(Boolean).length;

  return {
    filteredData,
    order, setOrder,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    soloConConfirmaciones, setSoloConConfirmaciones,
    numFiltrosActivos,
    resetFilters,
  };
}