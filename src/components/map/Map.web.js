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

export default function Map({
    showMarkers = true,
    showDistricts = true,
    alerts = [],
}) {

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

                {showMarkers && alerts
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

                {showDistricts && districts.map((district, index) => (
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
