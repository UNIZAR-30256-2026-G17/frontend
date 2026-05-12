import { useState, useMemo } from 'react';

const parseDate = (str) => {
  if (!str) return null;
  return new Date(str);
};

export function UseDelitosFilter(delitos = []) {

  const [order, setOrder]                     = useState(ORDER_OPTIONS[0]);
  const [tipoFilter, setTipoFilter]           = useState(null);
  const [distritoFilter, setDistritoFilter]   = useState(null);
  const [beatFilter, setBeatFilter]           = useState(null);
  const [statusFilter, setStatusFilter]       = useState(null);
  const [dateFrom, setDateFrom]               = useState(null);

  // ── Opciones dinámicas ──────────────────────────────────────────
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

  // ── Filtrado ────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return delitos
      .filter((row) => {
        if (tipoFilter?.value     && row.crimename1 !== tipoFilter.value)   return false;
        if (distritoFilter?.value && row.district   !== distritoFilter.value) return false;
        if (beatFilter?.value     && row.beat       !== beatFilter.value)   return false;
        if (statusFilter?.value   && row.status     !== statusFilter.value) return false;
        const rd = parseDate(row.start_date);
        if (dateFrom && rd && rd < dateFrom) return false;
        return true;
      })
      .sort((a, b) => {
        switch (order?.value) {
          case 'date_asc':     return new Date(a.start_date) - new Date(b.start_date);
          case 'district_asc': return (a.district || '').localeCompare(b.district || '');
          case 'type_asc':     return (a.crimename1 || '').localeCompare(b.crimename1 || '');
          default:             return new Date(b.start_date) - new Date(a.start_date);
        }
      });
  }, [order, tipoFilter, distritoFilter, beatFilter, statusFilter, dateFrom, delitos]);

  const resetFilters = () => {
    setTipoFilter(null);
    setDistritoFilter(null);
    setBeatFilter(null);
    setStatusFilter(null);
    setDateFrom(null);
  };

  const numFiltrosActivos = [
    tipoFilter?.value,
    distritoFilter?.value,
    beatFilter?.value,
    statusFilter?.value,
    dateFrom,
  ].filter(Boolean).length;

  return {
    filteredData,
    order, setOrder,
    tipoFilter, setTipoFilter,
    distritoFilter, setDistritoFilter,
    beatFilter, setBeatFilter,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    tipoOptions,
    distritoOptions,
    beatOptions,
    numFiltrosActivos,
    resetFilters,
  };
}

export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
  { label: 'Distrito (A-Z)',                        value: 'district_asc' },
  { label: 'Tipo de delito (A-Z)',                  value: 'type_asc' },
];

export const STATUS_OPTIONS = [
  { label: 'Disponible', value: 'available' },
  { label: 'Eliminado',  value: 'deleted' },
];