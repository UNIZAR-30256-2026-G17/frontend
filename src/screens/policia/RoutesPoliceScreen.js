/**
 * @file RoutesPoliceScreen.js
 * @description Pantalla para la visualización de rutas de patrullaje generadas.
 * Muestra las trayectorias sobre el mapa y un resumen de las patrullas asignadas.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import MapBeats from '../../components/map/Map.beats.web';

import { theme } from '../../theme';

/**
 * Componente RoutesPoliceScreen
 */
export const RoutesPoliceScreen = () => {
    const route = useRoute();

    // Recuperamos las rutas generadas desde los parámetros de navegación
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

                    {/* Contenedor del mapa con las rutas trazadas */}
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
        marginTop: theme.spacing.lg,
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        margin: theme.spacing.lg,
    },
    mapControls: {
        marginBottom: theme.spacing.sm,
    },
    mapContainer: {
        flex: 1,
    },
    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
    cardTextTitle: {
        ...theme.typography.bodyBold,
        color: theme.colors.cardText,
    },
});
