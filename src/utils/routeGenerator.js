// utils/routeGenerator.js
import { getRoutePathBeat } from './getRoutePathBeat';
// Importa tus coordenadas (ajusta la ruta del archivo según tu estructura)
import { beatsCoordinates } from '../config/beats';

export const generatePatrolRoutes = async (numPatrullas, beatICs) => {

    // 1. Ordenar beats por IC (propiedad 'id') de mayor a menor
    const sortedBeats = [...beatICs].sort((a, b) => {
        return parseFloat(b.id) - parseFloat(a.id);
    });

    // 2. Tomamos los top N beats con mayor criminalidad
    const targetBeats = sortedBeats.slice(0, numPatrullas);

    const routesPromises = targetBeats.map(async (beatData, index) => {

        // 3. Buscar las coordenadas correspondientes al nombre del beat
        const coordsInfo = beatsCoordinates.find(c => c.name === beatData.beat);

        // Si no se encuentra, usamos el caso 'own' o el centro por defecto
        const baseCoords = coordsInfo ? coordsInfo.coords : [39.1547, -77.2405];

        const centerLat = baseCoords[0];
        const centerLng = baseCoords[1];

        // 4. Generar puntos de patrullaje cerca del centro de ESE beat
        // Usamos un offset de 0.005 (~500 metros) para que la ruta se quede dentro del sector
        const origin = {
            latitude: centerLat + (Math.random() - 0.5) * 0.01,
            longitude: centerLng + (Math.random() - 0.5) * 0.01,
        };
        const destination = {
            latitude: centerLat + (Math.random() - 0.5) * 0.01,
            longitude: centerLng + (Math.random() - 0.5) * 0.01,
        };

        try {
            const path = await getRoutePathBeat(origin, destination, beatICs);

            return {
                id: `route-${index}-${beatData.beat}`,
                beatName: beatData.beat,
                ic: beatData.id,
                path: path
            };
        } catch (error) {
            console.error(`Error en ruta para beat ${beatData.beat}:`, error);
            return { path: null };
        }
    });

    // 5. Ejecutar todas las promesas y filtrar posibles nulos
    const results = await Promise.all(routesPromises);
    return results.filter(r => r.path !== null);
};
