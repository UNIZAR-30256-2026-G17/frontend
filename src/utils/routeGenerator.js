/**
 * @file routeGenerator.js
 * @description Utilidad para generar rutas de patrullaje automáticas basadas en la criminalidad de los Beats.
 * Selecciona los sectores con mayor IC y genera trayectorias aleatorias dentro de ellos.
 */

import { getRoutePathBeat } from './getRoutePathBeat';
import { beatsCoordinates } from '../config/beats';

/**
 * Genera un conjunto de rutas de patrullaje para las N zonas con mayor criminalidad.
 * 
 * @param {Number} numPatrullas - Cantidad de rutas a generar.
 * @param {Array} beatICs - Lista de beats con su correspondiente Índice de Criminalidad.
 * @returns {Promise<Array>} - Lista de objetos de ruta con su trayectoria y metadatos.
 */
export const generatePatrolRoutes = async (numPatrullas, beatICs) => {

    // 1. Ordenar todos los beats por IC (propiedad 'id') de mayor a menor peligrosidad
    const sortedBeats = [...beatICs].sort((a, b) => {
        return parseFloat(b.id) - parseFloat(a.id);
    });

    // 2. Seleccionamos los "N" beats con mayor criminalidad como objetivos de patrullaje
    const targetBeats = sortedBeats.slice(0, numPatrullas);

    const routesPromises = targetBeats.map(async (beatData, index) => {

        // 3. Buscamos las coordenadas geográficas del centro del beat
        const coordsInfo = beatsCoordinates.find(c => c.name === beatData.beat);

        // Si no se encuentra (caso raro), usamos el centro geográfico del condado por defecto
        const baseCoords = coordsInfo ? coordsInfo.coords : [39.1547, -77.2405];

        const centerLat = baseCoords[0];
        const centerLng = baseCoords[1];

        // 4. Generamos puntos de origen y destino aleatorios dentro del radio del beat
        // Usamos un offset de ~0.005 grados (aprox 500-1000m) para mantener la patrulla en su zona
        const origin = {
            latitude: centerLat + (Math.random() - 0.5) * 0.01,
            longitude: centerLng + (Math.random() - 0.5) * 0.01,
        };
        const destination = {
            latitude: centerLat + (Math.random() - 0.5) * 0.01,
            longitude: centerLng + (Math.random() - 0.5) * 0.01,
        };

        try {
            // Obtenemos la trayectoria táctica (que pase por las calles de mayor riesgo del beat)
            const path = await getRoutePathBeat(origin, destination, beatICs);

            return {
                id: `route-${index}-${beatData.beat}`,
                beatName: beatData.beat,
                ic: beatData.id,
                path: path
            };
        } catch (error) {
            console.error(`Error generando ruta para el beat ${beatData.beat}:`, error);
            return { path: null };
        }
    });

    // 5. Resolvemos todas las rutas en paralelo y filtramos las que fallaron
    const results = await Promise.all(routesPromises);
    return results.filter(r => r.path !== null);
};
