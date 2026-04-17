import React from 'react';
import { View } from 'react-native';
import { theme } from '../../theme';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const districtsCoordinates = [
    { name: 'ROCKVILLE', coords: [39.083997, -77.152758] },
    { name: 'SILVER SPRING', coords: [38.990665, -77.026088] },
    { name: 'MONTGOMERY VILLAGE', coords: [39.1765, -77.1953] },
    { name: 'GERMANTOWN', coords: [39.1732, -77.2717] },
    { name: 'BETHESDA', coords: [38.9847, -77.0947] },
    { name: 'TAKOMA PARK', coords: [38.9779, -77.0075] },
    { name: 'WHEATON', coords: [39.0398, -77.0511] },
];

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

export default function Map({
    showMarkers = true,
    showDistricts = true,
    markers = [],
    districtICs = [],
    routePoints = null,
}) {

    const normalize = (str) =>
        str?.toUpperCase().replace(/\s+/g, ' ').trim();

    const processedDistricts = districtICs
        .map(d => {
            const coord = districtsCoordinates.find(
                c => normalize(c.name) === normalize(d.district)
            );

            return {
                name: d.district,
                coords: coord?.coords,
                value: d.id,
            };
        })
        .filter(d => d.coords) // evita nulls
        .sort((a, b) => b.value - a.value) // mayor → menor
        .map((d, index) => ({
            ...d,
            color: colors[index] || theme.colors.ic7,
        }));

    return (
        <View style={{ flex: 1, minHeight: 300 }}>
            <MapContainer
                center={[39.1547, -77.2405]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {showMarkers && markers
                    .filter(a => a.location?.coordinates?.length === 2)
                    .map(alert => (
                        <Marker
                            key={alert._id}
                            position={[
                                alert.location.coordinates[1], // lat
                                alert.location.coordinates[0], // lng
                            ]}
                        >
                            <Popup>
                                <strong>{alert.description}</strong><br />
                                {alert.address}
                            </Popup>
                        </Marker>
                    ))
                }

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

                        {/* Opcional: Una línea simple que conecte ambos puntos */}
                        <Polyline
                            positions={[
                                [routePoints.origin.latitude, routePoints.origin.longitude],
                                [routePoints.destination.latitude, routePoints.destination.longitude]
                            ]}
                            pathOptions={{ color: theme.colors.primary, dashArray: '10, 10' }}
                        />
                    </>
                )}

                {showDistricts && processedDistricts.map((district, index) => (
                    <React.Fragment key={index}>
                        <Circle
                            center={district.coords}
                            radius={2700} // metros
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
