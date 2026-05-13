import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import MapBeats from '../../components/map/Map.beats.web';

import { theme } from '../../theme';

export const RoutesPoliceScreen = () => {
    const route = useRoute();

    const { routes = [] } = route.params || {};

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Rutas de patrullaje
                </Text>

                <View style={styles.content}>
                    <View style={styles.mapControls}>
                        <Card title="Resumen de Patrullas">
                            <Text style={styles.cardText}>
                                Se han generado <Text style={styles.cardTextTitle}>{routes.length}</Text> rutas de patrullaje en los beats con mayor IC.
                            </Text>
                        </Card>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapBeats
                            showMarkers={true}
                            showBeats={false}
                            routes={routes}
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
