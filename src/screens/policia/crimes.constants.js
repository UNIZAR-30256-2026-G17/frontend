export const COLS = [
  { header: 'Id',             key: 'id' },
  { header: 'Tipo de delito', key: 'tipo' },
  { header: 'Subtipo',        key: 'subtipo' },
  { header: 'Fecha',          key: 'fecha' },
  { header: 'Hora',           key: 'hora' },
  { header: 'Distrito',       key: 'distrito' },
  { header: 'Beat',           key: 'beat' },
  { header: 'Sector',         key: 'sector' },
];

export const EXPANDED_KEYS = ['fecha', 'hora', 'distrito', 'beat', 'sector'];

// ── Datos de prueba ─────────────────────────────────────────────────────────
export const SAMPLE_DATA = [
  { id: '201561908', tipo: 'Delito contra la sociedad',  subtipo: 'Otros delitos', fecha: '01-02-2026', hora: '20:48', distrito: 'TAKOMA PARK',   beat: 'T', sector: '8T2' },
  { id: '201561909', tipo: 'Delito contra la sociedad',  subtipo: 'Otros delitos', fecha: '01-02-2026', hora: '21:10', distrito: 'TAKOMA PARK',   beat: 'T', sector: '8T2' },
  { id: '201561910', tipo: 'Delito contra personas',     subtipo: 'Agresión',      fecha: '02-02-2026', hora: '08:30', distrito: 'SILVER SPRING', beat: 'S', sector: '4S1' },
  { id: '201561911', tipo: 'Delito contra la propiedad', subtipo: 'Robo',          fecha: '02-02-2026', hora: '14:15', distrito: 'BETHESDA',      beat: 'B', sector: '2B3' },
  { id: '201561912', tipo: 'Delito contra la sociedad',  subtipo: 'Otros delitos', fecha: '03-02-2026', hora: '19:00', distrito: 'ROCKVILLE',     beat: 'R', sector: '1R5' },
  { id: '201561913', tipo: 'Delito contra personas',     subtipo: 'Agresión',      fecha: '03-02-2026', hora: '23:45', distrito: 'TAKOMA PARK',   beat: 'T', sector: '8T2' },
  { id: '201561914', tipo: 'Delito contra la propiedad', subtipo: 'Vandalismo',    fecha: '04-02-2026', hora: '11:20', distrito: 'SILVER SPRING', beat: 'S', sector: '4S2' },
  { id: '201561915', tipo: 'Delito contra la sociedad',  subtipo: 'Otros delitos', fecha: '04-02-2026', hora: '16:55', distrito: 'BETHESDA',      beat: 'B', sector: '2B1' },
];

// Filtros predeterminados
export const ORDER_OPTIONS = [
  { label: 'Fecha: de más reciente a más antigua', value: 'date_desc' },
  { label: 'Fecha: de más antigua a más reciente', value: 'date_asc' },
  { label: 'Distrito (A-Z)',                        value: 'district_asc' },
  { label: 'Tipo de delito (A-Z)',                  value: 'type_asc' },
];

// Tipos de delitos
export const TIPO_OPTIONS = [
  { label: 'Todos',                        value: '' },
  { label: 'Delito contra la sociedad',    value: 'Delito contra la sociedad' },
  { label: 'Delito contra personas',       value: 'Delito contra personas' },
  { label: 'Delito contra la propiedad',   value: 'Delito contra la propiedad' },
];

// Distritos disponibles
export const DISTRITO_OPTIONS = [
  { label: 'Todos',         value: '' },
  { label: 'Takoma Park',   value: 'Takoma Park' },
  { label: 'Silver Spring', value: 'Silver Spring' },
  { label: 'Bethesda',      value: 'Bethesda' },
  { label: 'Rockville',     value: 'Rockville' },
  { label: 'Montgomery Village', value: 'Montgomery Village' },
  { label: 'Germantown',    value: 'Germantown' },
  { label: 'Wheaton',       value: 'Wheaton' },
];

export const BEAT_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: '1A1', value: '1A1' },
  { label: '1A2', value: '1A2' },
  { label: '1A3', value: '1A3' },
  { label: '1A4', value: '1A4' },
  { label: '1B1', value: '1B1' },
  { label: '1B2', value: '1B2' },
  { label: '1B3', value: '1B3' },
  { label: '1B4', value: '1B4' },
  { label: '1H2', value: '1H2' },
  { label: '1N2', value: '1N2' },
  { label: '1R2', value: '1R2' },
  { label: '2D1', value: '2D1' },
  { label: '2D2', value: '2D2' },
  { label: '2D3', value: '2D3' },
  { label: '2D4', value: '2D4' },
  { label: '2E1', value: '2E1' },
  { label: '2E2', value: '2E2' },
  { label: '2E3', value: '2E3' },
  { label: '2E4', value: '2E4' },
  { label: '3G1', value: '3G1' },
  { label: '3G2', value: '3G2' },
  { label: '3G3', value: '3G3' },
  { label: '3G4', value: '3G4' },
  { label: '3G5', value: '3G5' },
  { label: '3H1', value: '3H1' },
  { label: '3H2', value: '3H2' },
  { label: '3I1', value: '3I1' },
  { label: '3I2', value: '3I2' },
  { label: '3I3', value: '3I3' },
  { label: '3L1', value: '3L1' },
  { label: '4J1', value: '4J1' },
  { label: '4J2', value: '4J2' },
  { label: '4J3', value: '4J3' },
  { label: '4J4', value: '4J4' },
  { label: '4K1', value: '4K1' },
  { label: '4K2', value: '4K2' },
  { label: '4K3', value: '4K3' },
  { label: '4K4', value: '4K4' },
  { label: '4L1', value: '4L1' },
  { label: '4L2', value: '4L2' },
  { label: '4L3', value: '4L3' },
  { label: '5M1', value: '5M1' },
  { label: '5M2', value: '5M2' },
  { label: '5M3', value: '5M3' },
  { label: '5N1', value: '5N1' },
  { label: '5N2', value: '5N2' },
  { label: '5N3', value: '5N3' },
  { label: '6P1', value: '6P1' },
  { label: '6P2', value: '6P2' },
  { label: '6P3', value: '6P3' },
  { label: '6P4', value: '6P4' },
  { label: '6P6', value: '6P6' },
  { label: '6R1', value: '6R1' },
  { label: '6R2', value: '6R2' },
  { label: '6R3', value: '6R3' },
  { label: '8T1', value: '8T1' },
  { label: '8T2', value: '8T2' },
  { label: '8T3', value: '8T3' },
  { label: '-PG', value: '-PG' },
];

export const SECTOR_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'G', value: 'G' },
  { label: 'H', value: 'H' },
  { label: 'I', value: 'I' },
  { label: 'J', value: 'J' },
  { label: 'K', value: 'K' },
  { label: 'L', value: 'L' },
  { label: 'M', value: 'M' },
  { label: 'N', value: 'N' },
  { label: 'P', value: 'P' },
  { label: 'R', value: 'R' },
  { label: 'T', value: 'T' },
  { label: 'W', value: 'W' }
];
