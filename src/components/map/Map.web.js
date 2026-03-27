import React from 'react';
import { View } from 'react-native';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { theme } from '../../theme';

export default function Map() {
    const markers = [
        { id: 1, position: [39.2700, -77.3000], title: 'Clarksburg (norte)' },
        { id: 2, position: [39.2500, -77.2700], title: 'Germantown norte' },
        { id: 3, position: [39.2000, -77.2300], title: 'Montgomery Village' },
        { id: 4, position: [39.1800, -77.2600], title: 'Germantown centro' },
        { id: 5, position: [39.1547, -77.2405], title: 'Gaithersburg' },
        { id: 6, position: [39.1300, -77.2100], title: 'Derwood' },
        { id: 7, position: [39.1000, -77.3000], title: 'Potomac' },
        { id: 8, position: [39.1200, -77.3200], title: 'North Potomac' },
        { id: 9, position: [39.1200, -77.0500], title: 'Olney' },
        { id: 10, position: [39.1000, -77.0300], title: 'Norbeck' },
        { id: 11, position: [38.9900, -77.1000], title: 'Bethesda' },
        { id: 12, position: [38.9906, -77.0261], title: 'Silver Spring' },
        { id: 13, position: [38.9800, -77.0000], title: 'Takoma Park' },
        { id: 14, position: [39.0400, -77.0500], title: 'Wheaton' },
    ];

    const districts = [
        { name: 'Rockville', coords: [39.083997, -77.152758], ic: 5.6, color: theme.colors.ic1, },
        { name: 'Silver Spring', coords: [38.990665, -77.026088], ic: 4.3, color: theme.colors.ic2, },
        { name: 'Montgomery Village', coords: [39.1765, -77.1953], ic: 3.8, color: theme.colors.ic3, },
        { name: 'Germantown', coords: [39.1732, -77.2717], ic: 2.6, color: theme.colors.ic4, },
        { name: 'Bethesda', coords: [38.9847, -77.0947], ic: 1.8, color: theme.colors.ic5, },
        { name: 'Takoma Park', coords: [38.9779, -77.0075], ic: 0.9, color: theme.colors.ic6, },
        { name: 'Wheaton', coords: [39.0398, -77.0511], ic: 0.3, color: theme.colors.ic7, },
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

                {districts.map((district, index) => (
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
