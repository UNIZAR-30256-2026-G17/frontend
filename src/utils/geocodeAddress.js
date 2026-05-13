/**
 * @file geocodeAddress.js
 * @description Utilidad para convertir una dirección en texto (string) a coordenadas geográficas (latitud y longitud).
 * Utiliza el servicio Nominatim de OpenStreetMap con una lógica de reintentos basada en variaciones de la dirección.
 */

/**
 * Función de geocodificación
 * @param {String} address - Dirección completa a geocodificar
 * @returns {Object|null} - Objeto con { latitude, longitude } o null si no se encuentra
 */
export const geocodeAddress = async (address) => {
    console.log("Iniciando geocodificación de dirección:", address);
    
    // Generamos variaciones de la dirección para aumentar la probabilidad de éxito en Nominatim
    const variations = [address.trim()];
    const zipMatches = address.match(/\b\d{5}\b/g);
    const zipCode = zipMatches ? zipMatches[zipMatches.length - 1] : null;
    const parts = address.split(',');
    const streetPart = parts[0].trim();

    if (zipCode && streetPart && streetPart !== address.trim()) {
        variations.push(`${streetPart}, ${zipCode}`);
    }
    if (!address.toLowerCase().includes('montgomery county') && streetPart) {
        variations.push(`${streetPart}, Montgomery County, MD`);
    }

    // Probamos cada variación secuencialmente
    for (const query of variations) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
                {
                    headers: { 'User-Agent': 'montgomery-app/1.0 (874055@unizar.es)' }
                }
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                return {
                    latitude: parseFloat(data[0].lat),
                    longitude: parseFloat(data[0].lon),
                };
            }
        } catch (error) {
            console.error(`Geocoding error para "${query}":`, error.message);
        }
    }
    
    return null;
};
