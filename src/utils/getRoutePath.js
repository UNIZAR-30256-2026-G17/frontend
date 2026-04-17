/**
 * Fetches a driving route path between two points using the OSRM API.
 * 
 * @param {Object} origin - The starting point {latitude, longitude}
 * @param {Object} destination - The destination point {latitude, longitude}
 * @returns {Promise<Array|null>} An array of [lat, lng] coordinates or null if failed
 */
export const getRoutePath = async (origin, destination) => {
    if (!origin || !destination) return null;

    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`,
            {
                headers: { 'User-Agent': 'montgomery-app/1.0 (874055@unizar.es)' }
            }
        );

        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // OSRM returns coordinates as [longitude, latitude]
            // We need to convert them to [latitude, longitude] for Leaflet
            return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        }
        
        console.warn('No route found between points:', data.code);
        return null;
    } catch (error) {
        console.error('Error fetching route from OSRM:', error);
        return null;
    }
};
