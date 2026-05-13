/**
 * @file getRoutePath.js
 * @description Utilidad para obtener la ruta más segura entre dos puntos basándose en el Índice de Criminalidad (IC).
 * Realiza peticiones a la API de OSRM para obtener alternativas de ruta y evalúa el riesgo de cada una.
 */

import { districtsCoordinates } from '../config/districts';

/**
 * Calcula el nivel de riesgo promedio de una ruta basado en el IC de los distritos más cercanos.
 * @param {Array} path - Lista de coordenadas [lat, lng] de la ruta.
 * @param {Array} districtICs - Lista de objetos con el IC de cada distrito.
 * @returns {Number} - Puntuación de riesgo promedio.
 */
const calculatePathRisk = (path, districtICs) => {
    if (!districtICs || districtICs.length === 0) return 0;

    let totalRisk = 0;
    for (const [lat, lng] of path) {
        let minDistance = Infinity;
        let nearestIC = 0;

        for (const district of districtsCoordinates) {
            // Distancia euclidiana simple para aproximación rápida
            const d = Math.sqrt(Math.pow(lat - district.coords[0], 2) + Math.pow(lng - district.coords[1], 2));
            if (d < minDistance) {
                minDistance = d;
                const icData = districtICs.find(ic => 
                    ic.district && ic.district.toUpperCase() === district.name.toUpperCase()
                );
                nearestIC = icData ? icData.id : 0;
            }
        }
        totalRisk += nearestIC;
    }
    return totalRisk / path.length;
};

/**
 * Obtiene alternativas de ruta entre origen y destino y selecciona la que tiene menor riesgo.
 * 
 * @param {Object} origin - {latitude, longitude}
 * @param {Object} destination - {latitude, longitude}
 * @param {Array} districtICs - Lista de {district, id} (donde id es el IC)
 * @returns {Promise<Array|null>} - Lista de coordenadas [lat, lng] de la ruta más segura.
 */
export const getRoutePath = async (origin, destination, districtICs = []) => {
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
                const risk = calculatePathRisk(path, districtICs);
                return { path, risk };
            });

            // Log de riesgos para depuración
            console.log('Alternativas de ruta evaluadas (riesgo):', processedRoutes.map(r => r.risk));

            // Seleccionamos la ruta con el menor riesgo acumulado
            const safestRoute = processedRoutes.reduce((prev, curr) => 
                prev.risk < curr.risk ? prev : curr
            );

            console.log('Ruta más segura seleccionada con riesgo:', safestRoute.risk);
            return safestRoute.path;
        }
        
        console.warn('No se encontró ninguna ruta entre los puntos:', data.code);
        return null;
    } catch (error) {
        console.error('Error al obtener ruta de OSRM:', error);
        return null;
    }
};
