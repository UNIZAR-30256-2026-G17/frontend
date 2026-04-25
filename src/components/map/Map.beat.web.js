import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { theme } from '../../theme';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getRoutePath } from '../../utils/getRoutePath';
import { beatsCoordinates } from '../../config/beats';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const colors = [
    theme.colors.ic1,
    theme.colors.ic2,
    theme.colors.ic3,
    theme.colors.ic4,
    theme.colors.ic5,
    theme.colors.ic6,
    theme.colors.ic7,
];

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

const getColorForBeatIC = (value) => {
    if (value >= 5) return theme.colors.ic1;
    if (value >= 4) return theme.colors.ic2;
    if (value >= 3.5) return theme.colors.ic3;
    if (value >= 3) return theme.colors.ic4;
    if (value >= 2.5) return theme.colors.ic5;
    if (value >= 2) return theme.colors.ic6;
    return theme.colors.ic7;
};

export default function MapBeats({
    showBeats = true,
    beatICs = [],
    routes = [],
}) {
    const normalize = (str) =>
        str?.toUpperCase().replace(/\s+/g, ' ').trim();

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
        .filter(d => d.coords) // evita nulls

    return (
        <View style={{ flex: 1, minHeight: 300 }}>
            <MapContainer
                center={[39.1547, -77.2405]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {routes.map((route, index) => (
                    <React.Fragment key={`route-${index}`}>
                        {/* 1. Dibujar la línea del camino (path) */}
                        {route.path && (
                            <Polyline
                                positions={route.path} // Debe ser [[lat, lng], [lat, lng]...]
                                pathOptions={{
                                    color: theme.colors.primary,
                                    weight: 5,
                                    opacity: 0.7
                                }}
                            >
                                <Popup>Ruta de Patrulla {index + 1}</Popup>
                            </Polyline>
                        )}

                        {/* 2. Marcador de Origen (Verde) */}
                        {route.origin && (
                            <Marker
                                position={[route.origin.latitude, route.origin.longitude]}
                                icon={originIcon}
                            >
                                <Popup>Inicio Patrulla {index + 1}</Popup>
                            </Marker>
                        )}

                        {/* 3. Marcador de Destino (Rojo) */}
                        {route.destination && (
                            <Marker
                                position={[route.destination.latitude, route.destination.longitude]}
                                icon={destinationIcon}
                            >
                                <Popup>Punto de interés (Destino) {index + 1}</Popup>
                            </Marker>
                        )}
                    </React.Fragment>
                ))}

                {showBeats && processedBeats.map((beat, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            center={beat.coords}
                            radius={700} // metros
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
