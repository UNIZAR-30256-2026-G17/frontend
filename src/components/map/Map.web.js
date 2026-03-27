import React from 'react';
import { View } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Map() {
    const markers = [
        {
            id: 1,
            position: [39.1547, -77.2405],
            title: 'Centro Montgomery',
        },
        {
            id: 2,
            position: [39.1800, -77.2600],
            title: 'Zona norte',
        },
        {
            id: 3,
            position: [39.1400, -77.2000],
            title: 'Zona sur',
        },
        {
            id: 4,
            position: [39.1600, -77.3000],
            title: 'Zona oeste',
        },
        {
            id: 5,
            position: [39.1700, -77.1800],
            title: 'Zona este',
        },
    ];

    return (
        <View style={{ flex: 1, minHeight: 300 }}>
            <MapContainer
                center={[39.1547, -77.2405]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position}>
                        <Popup>{marker.title}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </View>
    );
}
