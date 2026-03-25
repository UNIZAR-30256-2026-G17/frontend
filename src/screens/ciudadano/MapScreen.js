import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';

import { Container } from '../../components/layout/Container';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';

import { theme } from '../../theme';

export const MapScreen = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [ICSelected, setICSelected] = useState(true);
    const [alertsSelected, setAlertsSelected] = useState(true);

    // Vector de alertas (SUSTITUIR por resultados de la API)
    const alerts = [
        {
            description: 'Posible robo de un vehículo en el parking del supermercado Costco',
            address: '206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.',
        },
        {
            description: 'Posible robo de un vehículo en el parking del supermercado Costco',
            address: '206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.',
        },
        {
            description: 'Posible robo de un vehículo en el parking del supermercado Costco',
            address: '206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.',
        },
        {
            description: 'Posible robo de un vehículo en el parking del supermercado Costco',
            address: '206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.',
        },
        {
            description: 'Posible robo de un vehículo en el parking del supermercado Costco',
            address: '206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.',
        },
    ];

    const ICs = [
        { value: 5.6, color: theme.colors.ic1, },
        { value: 4.3, color: theme.colors.ic2, },
        { value: 2.6, color: theme.colors.ic3, },
        { value: 1.8, color: theme.colors.ic4, },
        { value: 0.9, color: theme.colors.ic5, },
        { value: 0.3, color: theme.colors.ic6, },
    ];

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Mapa de Montgomery
                </Text>

                <View style={[
                    styles.layoutContainer,
                    isMobile && styles.layoutContainerMobile
                ]}>
                    {/* MAP (LEFT SIDE) */}
                    <View style={[
                        styles.leftPanel,
                        isMobile && styles.fullWidth
                    ]}>
                        <View style={styles.mapControls}>
                            <Card
                                title="Condado de Montgomery, Maryland, EE.UU."
                            >
                                <Checkbox
                                    label="Índice de criminalidad por distrito"
                                    defaultValue={ICSelected}
                                    onChange={setICSelected}
                                />
                                <Checkbox
                                    label="Alertas activas"
                                    defaultValue={alertsSelected}
                                    onChange={setAlertsSelected}
                                />

                                <View style={styles.sameRow}>
                                    <Button
                                        title="Crear alerta"
                                        icon="alert"
                                        variant="primary"
                                    />
                                    <Button
                                        title="Generar ruta"
                                        icon="plus"
                                        variant="primary"
                                    />
                                </View>
                            </Card>
                        </View>

                        <View style={styles.mapContainer}>
                            <Image
                                source={require('../../../assets/mapa.png')}
                                style={styles.mapImage}
                            />
                        </View>

                        {ICSelected && (
                            <View style={styles.mapLegend}>
                                <Card
                                    title="Índice de criminalidad"
                                >
                                    <View style={styles.sameRow}>
                                        {ICs.map((ic, index) => (
                                            <View key={index} style={styles.sameRow}>
                                                <View style={[styles.icBox, { backgroundColor: ic.color }]} />
                                                <Text style={styles.cardText}>
                                                    {ic.value}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </Card>
                            </View>
                        )}
                    </View>

                    {/* ALERTS (RIGHT SIDE) */}
                    {alertsSelected && (
                        <View style={[
                            styles.rightPanel,
                            isMobile && styles.fullWidth
                        ]}>
                            <FlatList
                                data={alerts}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={styles.alertsContainer}
                                renderItem={({ item, index }) => (
                                    <Card
                                        title={`Alerta ${index + 1}`}
                                        icon="alert"
                                    >
                                        <Text style={styles.cardText}>{item.description}</Text>
                                        <Text style={styles.cardText}>{item.address}</Text>

                                        <View style={styles.sameRow}>
                                            <Button
                                                title="Descartar"
                                                icon="trash"
                                                variant="danger"
                                            />
                                            <Button
                                                title="Confirmar"
                                                icon="check"
                                                variant="success"
                                            />
                                        </View>
                                    </Card>
                                )}
                            />
                        </View>
                    )}
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

    layoutContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 16,
        gap: 12,
    },
    layoutContainerMobile: {
        flexDirection: 'column',
    },

    leftPanel: {
        flex: 3,
        borderRadius: 16,
        overflow: 'hidden',
    },
    rightPanel: {
        flex: 1,
    },

    sameRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    fullWidth: {
        flex: 1,
    },
    mapImage: {
        width: '100%',
        minHeight: 300,
        flex: 1,
        resizeMode: 'cover',
    },
    mapControls: {
        position: 'absolute',
        zIndex: 1,
    },
    mapContainer: {
        flex: 1,
    },
    mapLegend: {
        marginTop: 8,
    },
    icBox: {
        width: 30,
        height: 20,
    },

    alertsContainer: {
        marginRight: 10,
        gap: 10,
    },
    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
    cardTextTitle: {
        fontWeight: 'bold',
    },
});