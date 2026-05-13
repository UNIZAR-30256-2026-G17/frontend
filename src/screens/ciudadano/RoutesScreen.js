/**
 * @file RoutesScreen.js
 * @description Pantalla para la visualización de rutas seguras para los ciudadanos.
 * Muestra la trayectoria más segura entre el origen y destino seleccionados.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import MapDistricts from '../../components/map/Map.districts.web';

import { theme } from '../../theme';

/**
 * Componente RoutesScreen
 */
export const RoutesScreen = () => {
    const route = useRoute();

    // Recuperamos los datos de la ruta desde los parámetros de navegación
    const { routeData = {} } = route.params || {};
    const { initialAddress, finalAddress, originCoords, destCoords, districtICs } = routeData;

    // Estructuramos los puntos para el componente de mapa
    const routePoints = originCoords && destCoords ? {
        origin: originCoords,
        destination: destCoords
    } : null;

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Ruta Segura
                </Text>

                <View style={styles.content}>
                    <View style={styles.mapControls}>
                        <Card title="Detalles del trayecto">
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Origen:</Text> {initialAddress || 'No especificada'}
                            </Text>
                            <Text style={styles.cardText}>
                                <Text style={styles.cardTextTitle}>Destino:</Text> {finalAddress || 'No especificada'}
                            </Text>
                        </Card>
                    </View>

                    {/* Mapa de distritos con la ruta segura trazada */}
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
        marginBottom: theme.spacing.xs,
    },
    cardTextTitle: {
        ...theme.typography.bodyBold,
        color: theme.colors.cardText,
    },
});
