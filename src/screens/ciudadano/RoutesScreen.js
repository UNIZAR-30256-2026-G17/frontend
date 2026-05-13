import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import MapDistricts from '../../components/map/Map.districts.web';

import { theme } from '../../theme';

export const RoutesScreen = () => {
    const route = useRoute();

    const { routeData = {} } = route.params || {};
    const { initialAddress, finalAddress, originCoords, destCoords, districtICs } = routeData;

    const routePoints = originCoords && destCoords ? {
        origin: originCoords,
        destination: destCoords
    } : null;

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Rutas
                </Text>
                [diff_block_end]

                [diff_block_start]
                <View style={styles.content}>
                    <View style={styles.mapControls}>
                        <Card
                            title="Ruta generada"
                        >
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Dirección de partida:</Text> {initialAddress || 'No especificada'}
                            </Text>
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Dirección de destino:</Text> {finalAddress || 'No especificada'}
                            </Text>
                        </Card>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapDistricts
                            showMarkers={false}
                            showDistricts={false}
                            routePoints={routePoints}
                            districtICs={districtICs}
                        />
                    </View>

                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginTop: 16,
        alignSelf: 'center',
    },
    text: {
        ...theme.typography.body,
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        margin: 16,
    },
    mapControls: {
        marginBottom: 8,
    },
    mapContainer: {
        flex: 1,
    },
    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
    cardTextTitle: {
        fontWeight: 'bold',
    },
});
