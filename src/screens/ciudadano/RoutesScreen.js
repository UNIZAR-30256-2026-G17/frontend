import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Map from '../../components/map/Map';

import { theme } from '../../theme';

export const RoutesScreen = () => {
    const route = useRoute();

    const { routeData } = route.params || {};

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Rutas
                </Text>

                <View style={styles.content}>
                    <View style={styles.mapControls}>
                        <Card
                            title="Ruta generada"
                        >
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Dirección de partida:</Text> {routeData.initialAddress}
                            </Text>
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Dirección de destino:</Text> {routeData.finalAddress}
                            </Text>
                        </Card>
                    </View>

                    <View style={styles.mapContainer}>
                        <Map
                            showMarkers={false}
                            showDistricts={false}
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
