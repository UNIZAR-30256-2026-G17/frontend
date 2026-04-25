import { beatsCoordinates } from '../config/beats';

/**
 * Calculates the average risk score for a given path based on the criminal index (IC)
 * of the nearest districts for each point in the path.
 */
const calculatePathRisk = (path, beatICs) => {
    if (!beatICs || beatICs.length === 0) return 0;

    let totalRisk = 0;
    for (const [lat, lng] of path) {
        let minDistance = Infinity;
        let nearestIC = 0;

        for (const beat of beatsCoordinates) {
            // Simple Euclidean distance for approximation
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
 * Fetches driving route alternatives between two points and selects the safest one.
 * 
 * @param {Object} origin - {latitude, longitude}
 * @param {Object} destination - {latitude, longitude}
 * @param {Array} districtICs - Array of {district, id} objects
 * @returns {Promise<Array|null>} Safest path as [lat, lng] coordinates
 */
export const getRoutePathBeat = async (origin, destination, beatICs = []) => {
    if (!origin || !destination) return null;

    try {
        // Request alternatives from OSRM
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

            // Log risks for debugging
            console.log('Route alternatives evaluated:', processedRoutes.map(r => r.risk));

            // Select the route with the minimum risk
            const tacticalRoute = processedRoutes.reduce((prev, curr) =>
                prev.risk > curr.risk ? prev : curr
            );

            console.log('Tactical route selected with risk score:', tacticalRoute.risk);
            return tacticalRoute.path;
        }

        console.warn('No route found between points:', data.code);
        return null;
    } catch (error) {
        console.error('Error fetching route from OSRM:', error);
        return null;
    }
};
