/**
 * @file getRoutePathBeat.js
 * @description Utilidad para obtener una ruta "táctica" (de mayor riesgo) entre dos puntos basándose en el IC de los Beats.
 * Se utiliza principalmente para sugerir rutas de patrullaje que pasen por zonas con mayor índice de criminalidad.
 */

import { beatsCoordinates } from '../config/beats';

/**
 * Calcula el nivel de riesgo promedio de una ruta basado en el IC de los beats más cercanos.
 * @param {Array} path - Lista de coordenadas [lat, lng] de la ruta.
 * @param {Array} beatICs - Lista de objetos con el IC de cada beat.
 * @returns {Number} - Puntuación de riesgo promedio.
 */
const calculatePathRisk = (path, beatICs) => {
    if (!beatICs || beatICs.length === 0) return 0;

    let totalRisk = 0;
    for (const [lat, lng] of path) {
        let minDistance = Infinity;
        let nearestIC = 0;

        for (const beat of beatsCoordinates) {
            // Distancia euclidiana simple para aproximación rápida
            const d = Math.sqrt(Math.pow(lat - beat.coords[0], 2) + Math.pow(lng - beat.coords[1], 2));
            if (d < minDistance) {
                minDistance = d;
                const icData = beatICs.find(ic =>
                    ic.beat && ic.beat.toUpperCase() === beat.name.toUpperCase()
                );
                nearestIC = icData ? icData.id : 0;
            }
        }
        totalRisk += nearestIC;
    }
    return totalRisk / path.length;
};

/**
 * Obtiene alternativas de ruta entre origen y destino y selecciona la que tiene MAYOR riesgo (táctica).
 * 
 * @param {Object} origin - {latitude, longitude}
 * @param {Object} destination - {latitude, longitude}
 * @param {Array} beatICs - Lista de {beat, id} (donde id es el IC)
 * @returns {Promise<Array|null>} - Lista de coordenadas [lat, lng] de la ruta táctica.
 */
export const getRoutePathBeat = async (origin, destination, beatICs = []) => {
    if (!origin || !destination) return null;

    try {
        // Solicitamos rutas alternativas a OSRM
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&alternatives=true`,
            {
                headers: { 'User-Agent': 'montgomery-app/1.0 (874055@unizar.es)' }
            }
        );

        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            const processedRoutes = data.routes.map(route => {
                const path = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                const risk = calculatePathRisk(path, beatICs);
                return { path, risk };
            });

            // Log de riesgos para depuración
            console.log('Alternativas de ruta evaluadas (riesgo):', processedRoutes.map(r => r.risk));

            // Seleccionamos la ruta con el MAYOR riesgo (para patrullaje táctico)
            const tacticalRoute = processedRoutes.reduce((prev, curr) =>
                prev.risk > curr.risk ? prev : curr
            );

            console.log('Ruta táctica seleccionada con riesgo:', tacticalRoute.risk);
            return tacticalRoute.path;
        }

        console.warn('No se encontró ninguna ruta entre los puntos:', data.code);
        return null;
    } catch (error) {
        console.error('Error al obtener ruta de OSRM:', error);
        return null;
    }
};
