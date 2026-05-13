/**
 * @file beats.js
 * @description Listado de coordenadas centrales de los Sectores (Beats) del Condado de Montgomery.
 * Permite identificar la posición geográfica de cada beat para cálculos de criminalidad y rutas.
 */

export const beatsCoordinates = [
    // Distrito 1 (Rockville)
    { name: '1A1', coords: [39.0840, -77.1520] },
    { name: '1A2', coords: [39.0950, -77.1250] },
    { name: '1A3', coords: [39.1150, -77.1700] },
    { name: '1A4', coords: [39.0700, -77.1950] },
    { name: '1B1', coords: [39.0450, -77.1350] },
    { name: '1B2', coords: [39.0350, -77.1850] },
    { name: '1B3', coords: [39.0550, -77.2150] },

    // Distrito 2 (Bethesda)
    { name: '2D1', coords: [38.9917, -77.0297] },
    { name: '2D2', coords: [38.9980, -77.0450] },
    { name: '2D3', coords: [39.0150, -77.0350] },
    { name: '2D4', coords: [38.9850, -77.0600] },
    { name: '2E1', coords: [38.9810, -77.0950] },
    { name: '2E2', coords: [38.9750, -77.1100] },
    { name: '2E3', coords: [39.0050, -77.1000] },
    { name: '2E4', coords: [38.9650, -77.1350] },

    // Distrito 3 (Silver Spring)
    { name: '3G1', coords: [38.9930, -77.0280] },
    { name: '3G2', coords: [39.0100, -77.0150] },
    { name: '3G3', coords: [38.9850, -76.9950] },
    { name: '3H1', coords: [39.0350, -77.0050] },
    { name: '3H2', coords: [39.0550, -76.9850] },
    { name: '3I1', coords: [39.0450, -76.9450] },
    { name: '3I2', coords: [39.0650, -76.9550] },
    { name: '3I3', coords: [39.0850, -76.9350] },
    { name: '3L1', coords: [39.1250, -76.9450] },

    // Distrito 4 (Wheaton)
    { name: '4J1', coords: [39.0380, -77.0510] },
    { name: '4J2', coords: [39.0550, -77.0650] },
    { name: '4K1', coords: [39.0650, -77.0350] },
    { name: '4K2', coords: [39.0850, -77.0450] },
    { name: '4K3', coords: [39.1050, -77.0250] },
    { name: '4L1', coords: [39.1250, -77.0550] },
    { name: '4L2', coords: [39.1450, -77.0450] },
    { name: '4L3', coords: [39.1650, -77.0350] },

    // Distrito 5 (Germantown)
    { name: '5M1', coords: [39.1850, -77.2650] },
    { name: '5M2', coords: [39.1750, -77.2550] },
    { name: '5M3', coords: [39.1950, -77.2450] },
    { name: '5N1', coords: [39.2250, -77.2150] },
    { name: '5N2', coords: [39.2150, -77.2250] },
    { name: '5N3', coords: [39.2350, -77.2050] },

    // Distrito 6 (Montgomery Village / Gaithersburg)
    { name: '6P1', coords: [39.1450, -77.2050] },
    { name: '6P2', coords: [39.1650, -77.1850] },
    { name: '6P3', coords: [39.1750, -77.2150] },
    { name: '6R1', coords: [39.1250, -77.2350] },
    { name: '6R2', coords: [39.1150, -77.2150] },
    { name: '6R3', coords: [39.1350, -77.2550] },

    // Distrito 8 (Olney)
    { name: '8T1', coords: [39.1550, -77.0650] },
    { name: '8T2', coords: [39.1350, -77.0750] },
    { name: '8T3', coords: [39.1750, -77.0550] },

    // Caso especial o desconocido
    { name: 'own', coords: [39.1547, -77.2405] } // Ubicación central por defecto
];