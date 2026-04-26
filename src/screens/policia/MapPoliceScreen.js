import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useWindowDimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import MapBeats from '../../components/map/Map.beats.web';

import GenerateRoutesModal from './GenerateRoutesModal';
import { generatePatrolRoutes } from '../../utils/routeGenerator';

import { API_URL } from '../../config/env';

const ICs = [
    { label: '> 5', color: theme.colors.ic1 },
    { label: '4 - 5', color: theme.colors.ic2 },
    { label: '3.5 - 4', color: theme.colors.ic3 },
    { label: '3 - 3.5', color: theme.colors.ic4 },
    { label: '2.5 - 3', color: theme.colors.ic5 },
    { label: '2 - 2.5', color: theme.colors.ic6 },
    { label: '< 2', color: theme.colors.ic7 },
];

export const MapPoliceScreen = () => {
    const { user, loading } = useAuth();
    const navigation = useNavigation();

    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [ICSelected, setICSelected] = useState(true);
    const [beatICs, setBeatICs] = useState([]);

    const [modalGenerateRoutesVisible, setModalGenerateRoutesVisible] = useState(false);
    const [patrolRoutes, setPatrolRoutes] = useState([]);

    useEffect(() => {
        if (user && user.token) {
            fetchBeatsICsLastDay();
        }
    }, [user]);

    const fetchBeatsICsLastDay = async () => {
        console.log("DENTRO");
        try {
            const response = await fetch(
                `${API_URL}/ic_beat?time=day`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }
            );

            const data = await response.json();
            console.log("DATA:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Error obteniendo ICs');
            }

            setBeatICs(data.beatsICs);

        } catch (error) {
            console.error('Error ICs:', error);
        }
    };

    const handleGenerateRoutes = async (data) => {
        const n = parseInt(data.numPatrullas);

        try {
            if (beatICs.length === 0) throw new Error("No hay datos de IC cargados");

            // Generamos las rutas basadas en los top N beats
            const routes = await generatePatrolRoutes(n, beatICs);

            // Filtramos las que fallaron (path null)
            const validRoutes = routes.filter(r => r.path !== null);

            setModalGenerateRoutesVisible(false);

            // Navegamos a la pantalla de visualización enviando el array de rutas
            navigation.navigate('RoutesPolice', {
                isMultiple: true,
                routes: validRoutes,
                count: n
            });

        } catch (error) {
            setModalGenerateRoutesVisible(false);
            console.error("Error al generar patrullas:", error);
            Alert.alert("Error", "No se pudieron generar las rutas de patrullaje.");
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>Mapa de Montgomery</Text>


                <View style={[
                    styles.layoutContainer
                ]}>
                    <View style={styles.buttonRightContainer}>
                        <Button
                            title="Generar rutas de patrullaje"
                            icon="plus"
                            variant="primary"
                            onPress={() => setModalGenerateRoutesVisible(true)}
                        />
                    </View>

                    <View>
                        <Card
                            title="Condado de Montgomery, Maryland, EE.UU."
                        >
                            <View style={[styles.sameRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                <View style={styles.sameRow}>
                                    <Checkbox
                                        label="Índice de criminalidad por beat"
                                        defaultValue={ICSelected}
                                        onChange={setICSelected}
                                    />
                                </View>
                            </View>
                        </Card>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapBeats
                            showBeats={ICSelected}
                            beatICs={beatICs}
                        />
                    </View>

                    {ICSelected && (
                        <Card
                            title="Índice de criminalidad"
                        >
                            <View style={styles.sameRow}>
                                {ICs.map((ic, index) => (
                                    <View key={index} style={styles.sameRow}>
                                        <View style={[styles.icBox, { backgroundColor: ic.color }]} />
                                        <Text style={styles.cardText}>
                                            {ic.label}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    )}
                </View>

                <GenerateRoutesModal
                    visible={modalGenerateRoutesVisible}
                    onClose={() => setModalGenerateRoutesVisible(false)}
                    onConfirm={handleGenerateRoutes}
                />
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
        margin: 16,
        gap: 8,
    },

    buttonRightContainer: {
        alignItems: 'flex-end',
    },

    sameRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    fullWidth: {
        flex: 1,
    },
    map: {
        flex: 1,
        minHeight: 300,
    },
    mapContainer: {
        flex: 1,
    },
    icBox: {
        width: 30,
        height: 20,
    },

    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
    cardTextTitle: {
        fontWeight: 'bold',
    },
});
