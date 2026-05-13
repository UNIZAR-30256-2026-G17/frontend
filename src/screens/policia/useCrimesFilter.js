/**
 * @file UseCrimesFilter.js
 * @description Hook personalizado para la gestión de filtros en la pantalla de visualización de delitos policiales.
 * Permite filtrar por tipo, distrito, beat y rango de fechas.
 */

import { useState, useMemo } from 'react';
import {
  SAMPLE_DATA, ORDER_OPTIONS, TIPO_OPTIONS,
  DISTRITO_OPTIONS, BEAT_OPTIONS,
} from './crimes.constants';

/**
 * Parsea una cadena de fecha con formato DD-MM-YYYY a un objeto Date
 */
const parseDate = (str) => {
  const [d, m, y] = str.split('-');
  return new Date(`${y}-${m}-${d}`);
};

/**
 * Hook UseCrimesFilter
 */
export default function useCrimesFilter() {
  const [order, setOrder] = useState(ORDER_OPTIONS[0]);
  const [tipoFilter, setTipoFilter] = useState(TIPO_OPTIONS[0]);
  const [distritoFilter, setDistritoFilter] = useState(DISTRITO_OPTIONS[0]);
  const [beatFilter, setBeatFilter] = useState(BEAT_OPTIONS[0]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // Lógica de procesamiento de datos en memoria (mock data)
  const filteredData = useMemo(() => {
    return SAMPLE_DATA
      .filter((row) => {
        if (tipoFilter?.value && row.tipo !== tipoFilter.value) return false;
        if (distritoFilter?.value && row.distrito !== distritoFilter.value) return false;
        if (beatFilter?.value && row.beat !== beatFilter.value) return false;
        const rd = parseDate(row.fecha);
        if (dateFrom && rd < dateFrom) return false;
        if (dateTo && rd > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        switch (order?.value) {
          case 'date_asc': return parseDate(a.fecha) - parseDate(b.fecha);
          case 'district_asc': return a.distrito.localeCompare(b.distrito);
          case 'type_asc': return a.tipo.localeCompare(b.tipo);
          default: return parseDate(b.fecha) - parseDate(a.fecha);
        }
      });
  }, [order, tipoFilter, distritoFilter, beatFilter, dateFrom, dateTo]);

  /**
   * Limpia todos los selectores de filtro
   */
  const resetFilters = () => {
    setTipoFilter(TIPO_OPTIONS[0]);
    setDistritoFilter(DISTRITO_OPTIONS[0]);
    setBeatFilter(BEAT_OPTIONS[0]);
    setDateFrom(null);
    setDateTo(null);
  };

  return {
    filteredData,
    order, setOrder,
    tipoFilter, setTipoFilter,
    distritoFilter, setDistritoFilter,
    beatFilter, setBeatFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    resetFilters,
  };
};
