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
    // routePoints = null,
}) {
    // const [routePath, setRoutePath] = useState([]);

    // useEffect(() => {
    //     const fetchRoute = async () => {
    //         if (routePoints?.origin && routePoints?.destination) {
    //             const path = await getRoutePath(routePoints.origin, routePoints.destination, districtICs);
    //             if (path) {
    //                 setRoutePath(path);
    //             } else {
    //                 // Fallback to straight line if API fails
    //                 setRoutePath([
    //                     [routePoints.origin.latitude, routePoints.origin.longitude],
    //                     [routePoints.destination.latitude, routePoints.destination.longitude]
    //                 ]);
    //             }
    //         } else {
    //             setRoutePath([]);
    //         }
    //     };

    //     fetchRoute();
    // }, [routePoints]);

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

                {/* {routePoints && (
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
                                pathOptions={{ color: theme.colors.primary, weight: 4 }}
                            />
                        )}
                    </>
                )} */}

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
