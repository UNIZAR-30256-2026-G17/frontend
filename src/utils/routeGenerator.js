// utils/routeGenerator.js
import { getRoutePath } from './getRoutePath'; // Tu función actual de OSRM

export const generatePatrolRoutes = async (numPatrullas, beatICs) => {
    // 1. Ordenar beats por IC descendente y tomar los top N
    const topBeats = [...beatICs]
        .sort((a, b) => b.id - a.id) // Suponiendo que 'id' es el valor del IC
        .slice(0, numPatrullas);

    const routesPromises = topBeats.map(async (beat) => {
        // Asumimos que beat tiene coordenadas o centroide. 
        // Si no, necesitamos un mapeo de 'beat.beat' (nombre) a coordenadas.
        // Simularemos un punto origen y destino aleatorio dentro del sector
        // Para este ejemplo, usaré coordenadas base de Montgomery y un offset aleatorio
        const centerLat = beat.latitude || 39.1547;
        const centerLng = beat.longitude || -77.2405;

        const origin = {
            latitude: centerLat + (Math.random() - 0.5) * 0.02,
            longitude: centerLng + (Math.random() - 0.5) * 0.02,
        };
        const destination = {
            latitude: centerLat + (Math.random() - 0.5) * 0.02,
            longitude: centerLng + (Math.random() - 0.5) * 0.02,
        };

        const path = await getRoutePath(origin, destination, beatICs);
        return {
            beatName: beat.beat,
            ic: beat.id,
            path: path
        };
    });

    return Promise.all(routesPromises);
};
