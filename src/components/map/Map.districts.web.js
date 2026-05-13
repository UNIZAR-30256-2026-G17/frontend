/**
 * @file Map.districts.web.js
 * @description Componente de mapa basado en Leaflet para ciudadanos.
 * Muestra alertas activas, distritos coloreados por IC y rutas seguras calculadas.
 */

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { theme } from '../../theme';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getRoutePath } from '../../utils/getRoutePath';
import { districtsCoordinates } from '../../config/districts';

// Corrección para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Determina el color del distrito basado en su Índice de Criminalidad (IC) para ciudadanos
 * @param {Number} value - Valor del IC del distrito
 */
const getColorForDistrictIC = (value) => {
    if (value >= 28) return theme.colors.ic1;
    if (value >= 24) return theme.colors.ic2;
    if (value >= 19) return theme.colors.ic3;
    if (value >= 15) return theme.colors.ic4;
    if (value >= 10) return theme.colors.ic5;
    if (value >= 5) return theme.colors.ic6;
    return theme.colors.ic7;
};

// Iconos personalizados para origen y destino
const originIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

/**
 * Componente MapDistricts
 */
export default function MapDistricts({
    showMarkers = true,
    showDistricts = true,
    markers = [],
    districtICs = [],
    routePoints = null,
}) {
    const [routePath, setRoutePath] = useState([]);

    // Efecto para calcular la ruta segura cuando cambian los puntos de origen/destino
    useEffect(() => {
        const fetchRoute = async () => {
            if (routePoints?.origin && routePoints?.destination) {
                const path = await getRoutePath(routePoints.origin, routePoints.destination, districtICs);
                if (path) {
                    setRoutePath(path);
                } else {
                    // Fallback a línea recta si falla la API de OSRM
                    setRoutePath([
                        [routePoints.origin.latitude, routePoints.origin.longitude],
                        [routePoints.destination.latitude, routePoints.destination.longitude]
                    ]);
                }
            } else {
                setRoutePath([]);
            }
        };

        fetchRoute();
    }, [routePoints, districtICs]);

    /**
     * Normaliza nombres para búsqueda en configuración
     */
    const normalize = (str) =>
        str?.toUpperCase().replace(/\s+/g, ' ').trim();

    // Procesamos los distritos vinculando ICs con coordenadas del centroide
    const processedDistricts = districtICs
        .map(d => {
            const coord = districtsCoordinates.find(
                c => normalize(c.name) === normalize(d.district)
            );

            return {
                name: d.district,
                coords: coord?.coords,
                value: d.id,
                color: getColorForDistrictIC(d.id),
            };
        })
        .filter(d => d.coords);

    return (
        <View style={{ flex: 1, minHeight: 300 }}>
            <MapContainer
                center={[39.1547, -77.2405]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Marcadores de alertas ciudadanas */}
                {showMarkers && markers
                    .filter(a => a.location?.coordinates?.length === 2)
                    .map(alert => (
                        <Marker
                            key={alert._id}
                            position={[
                                alert.location.coordinates[1], // latitud
                                alert.location.coordinates[0], // longitud
                            ]}
                        >
                            <Popup>
                                <strong>{alert.description}</strong><br />
                                {alert.address}
                            </Popup>
                        </Marker>
                    ))
                }

                {/* Visualización de la ruta segura calculada */}
                {routePoints && (
                    <>
                        <Marker
                            position={[routePoints.origin.latitude, routePoints.origin.longitude]}
                            icon={originIcon}
                        >
                            <Popup><strong>Origen de la ruta</strong></Popup>
                        </Marker>

                        <Marker
                            position={[routePoints.destination.latitude, routePoints.destination.longitude]}
                            icon={destinationIcon}
                        >
                            <Popup><strong>Destino de la ruta</strong></Popup>
                        </Marker>

                        {routePath.length > 0 && (
                            <Polyline
                                positions={routePath}
                                pathOptions={{
                                    color: theme.colors.routeColor,
                                    weight: 4,
                                }}
                            />
                        )}
                    </>
                )}

                {/* Círculos de calor por distrito */}
                {showDistricts && processedDistricts.map((district, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            center={district.coords}
                            radius={2700} // Radio visual para cobertura de distrito
                            pathOptions={{
                                color: district.color,
                                fillColor: district.color,
                                fillOpacity: 0.3,
                            }}
                        />
                    </React.Fragment>
                ))}
            </MapContainer>
        </View>
    );
}
