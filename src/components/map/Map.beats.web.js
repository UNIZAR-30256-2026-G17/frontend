/**
 * @file Map.beats.web.js
 * @description Componente de mapa basado en Leaflet para la visualización de Sectores (Beats) y rutas de patrullaje.
 * Utilizado por el personal policial para identificar zonas de alto riesgo y trayectorias asignadas.
 */
import React from 'react';
import { View } from 'react-native';
import { theme } from '../../theme';
import { MapContainer, TileLayer, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { beatsCoordinates } from '../../config/beats';

// Corrección para los iconos de Leaflet en entornos de empaquetado (webpack/vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Determina el color del beat basado en su Índice de Criminalidad (IC)
 * @param {Number} value - Valor del IC del beat
 * @returns {String} - Color hexadecimal del tema
 */
const getColorForBeatIC = (value) => {
    if (value >= 5) return theme.colors.ic1;
    if (value >= 4) return theme.colors.ic2;
    if (value >= 3.5) return theme.colors.ic3;
    if (value >= 3) return theme.colors.ic4;
    if (value >= 2.5) return theme.colors.ic5;
    if (value >= 2) return theme.colors.ic6;
    return theme.colors.ic7;
};

/**
 * Componente MapBeats
 */
export default function MapBeats({
    showBeats = true,
    beatICs = [],
    routes = [],
}) {
    /**
     * Normaliza nombres de beats para comparaciones precisas
     */
    const normalize = (str) =>
        str?.toUpperCase().replace(/\s+/g, ' ').trim();

    // Procesamos los datos de los beats para vincular ICs con coordenadas geográficas
    const processedBeats = beatICs
        .map(d => {
            const coord = beatsCoordinates.find(
                c => normalize(c.name) === normalize(d.beat)
            );

            return {
                name: d.beat,
                coords: coord?.coords,
                value: d.id,
                color: getColorForBeatIC(d.id),
            };
        })
        .filter(d => d.coords); // Filtrar aquellos sin coordenadas válidas

    return (
        <View style={{ flex: 1, minHeight: 300 }}>
            <MapContainer
                center={[39.1547, -77.2405]} // Centro del Condado de Montgomery
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Renderizado de rutas de patrullaje */}
                {Array.isArray(routes) && routes.map((route, index) => (
                    <React.Fragment key={`route-${index}`}>
                        {route && route.path && (
                            <Polyline
                                positions={route.path}
                                pathOptions={{
                                    color: theme.colors.routeColor,
                                    weight: 5,
                                    opacity: 0.7
                                }}
                            >
                                <Popup>Ruta de Patrulla {index + 1}</Popup>
                            </Polyline>
                        )}
                    </React.Fragment>
                ))}

                {/* Renderizado de círculos de calor para cada Beat */}
                {showBeats && processedBeats.map((beat, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            center={beat.coords}
                            radius={700} // Radio fijo en metros para visualización de sector
                            pathOptions={{
                                color: beat.color,
                                fillColor: beat.color,
                                fillOpacity: 0.3,
                            }}
                        />
                    </React.Fragment>
                ))}
            </MapContainer>
        </View>
    );
}
