import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function Map() {
    return (
        <MapView
            style={{ flex: 1, minHeight: 300 }}
            initialRegion={{
                latitude: 39.1547,
                longitude: -77.2405,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            }}
        >
            <Marker
                coordinate={{ latitude: 39.1547, longitude: -77.2405 }}
                title="Montgomery"
            />
        </MapView>
    );
}
