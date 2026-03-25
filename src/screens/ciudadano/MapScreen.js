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
                                    defaultValue={true}
                                    onChange={(value) => console.log(value)}
                                />
                                <Checkbox
                                    label="Alertas activas"
                                    defaultValue={true}
                                    onChange={(value) => console.log(value)}
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

                        <Image
                            source={require('../../../assets/mapa.png')}
                            style={styles.mapImage}
                        />
                    </View>

                    {/* ALERTS (RIGHT SIDE) */}
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
        height: '100%',
        resizeMode: 'cover',
    },
    mapControls: {
        position: 'absolute',
        zIndex: 1,
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