/**
 * @file useCrimesFilter.js
 * @description Hook personalizado para la gestión de filtros en la pantalla de visualización de delitos policiales.
 */

import { useState, useMemo } from 'react';

const parseDate = (str) => {
  if (!str) return null;
  return new Date(str);
};

export default function useCrimesFilter(delitos = []) {
  const [order, setOrder] = useState({ label: 'Fecha: de más reciente a más antigua', value: 'date_desc' });
  const [tipoFilter, setTipoFilter] = useState(null);
  const [distritoFilter, setDistritoFilter] = useState(null);
  const [beatFilter, setBeatFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);

  const tipoOptions = useMemo(() => {
    const unique = [...new Set(delitos.map(d => d.crimename1).filter(Boolean))].sort();
    return [{ label: 'Todos', value: '' }, ...unique.map(v => ({ label: v, value: v }))];
  }, [delitos]);

  const distritoOptions = useMemo(() => {
    const unique = [...new Set(delitos.map(d => d.district).filter(Boolean))].sort();
    return [{ label: 'Todos', value: '' }, ...unique.map(v => ({ label: v, value: v }))];
  }, [delitos]);

  const beatOptions = useMemo(() => {
    const unique = [...new Set(delitos.map(d => d.beat).filter(Boolean))].sort();
    return [{ label: 'Todos', value: '' }, ...unique.map(v => ({ label: v, value: v }))];
  }, [delitos]);

  const filteredData = useMemo(() => {
    return delitos
      .filter((row) => {
        if (row.status === 'deleted') return false;
        
        if (tipoFilter?.value && row.crimename1 !== tipoFilter.value) return false;
        if (distritoFilter?.value && row.district !== distritoFilter.value) return false;
        if (beatFilter?.value && row.beat !== beatFilter.value) return false;
        const rd = parseDate(row.start_date);
        if (dateFrom && rd && rd < dateFrom) return false;
        return true;
      })
      .sort((a, b) => {
        switch (order?.value) {
          case 'date_asc': return new Date(a.start_date) - new Date(b.start_date);
          case 'district_asc': return (a.district || '').localeCompare(b.district || '');
          case 'type_asc': return (a.crimename1 || '').localeCompare(b.crimename1 || '');
          default: return new Date(b.start_date) - new Date(a.start_date);
        }
      });
  }, [order, tipoFilter, distritoFilter, beatFilter, dateFrom, delitos]);

  const resetFilters = () => {
    setTipoFilter(null);
    setDistritoFilter(null);
    setBeatFilter(null);
    setDateFrom(null);
  };

  const numFiltrosActivos = [
    tipoFilter?.value,
    distritoFilter?.value,
    beatFilter?.value,
    dateFrom,
  ].filter(Boolean).length;

  return {
    filteredData,
    order, setOrder,
    tipoFilter, setTipoFilter,
    distritoFilter, setDistritoFilter,
    beatFilter, setBeatFilter,
    dateFrom, setDateFrom,
    tipoOptions,
    distritoOptions,
    beatOptions,
    resetFilters,
    numFiltrosActivos,
  };
}
