import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';

import { Container } from '../../components/layout/Container';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { theme } from '../../theme';

export const MapScreen = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
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
                        <Card
                            title="Alerta 1"
                            icon="alert"
                        >
                            <Text style={styles.cardText}>
                                Posible robo de un vehículo en el parking del supermercado Costco
                            </Text>
                            <Text style={styles.cardText}>
                                206-202 Mt Vernon PI, Rockville, MD 20852, EE.UU.
                            </Text>
                            <View style={styles.sameRow}>
                                <Button
                                    title="Descartar"
                                    icon="trash"
                                    variant="danger"
                                    onPress={() => console.log('Descartar')}
                                />
                                <Button
                                    title="Confirmar"
                                    icon="check"
                                    variant="success"
                                    onPress={() => console.log('Confirmar')}
                                />
                            </View>
                        </Card>
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
        borderRadius: 12,
        overflow: 'hidden',
    },
    rightPanel: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground, // BORRAR
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

    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
});