import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useWindowDimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import CreateAlertModal from './CreateAlertModal';
import GenerateRouteModal from './GenerateRouteModal';
import Map from '../../components/map/Map';

import { API_URL } from '../../config/api';

export const MapScreen = () => {
    const navigation = useNavigation();

    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [ICSelected, setICSelected] = useState(true);
    const [alertsSelected, setAlertsSelected] = useState(true);

    const [alerts, setAlerts] = useState([]);

    // Vector de ICs (SUSTITUIR por resultados de la API)
    const ICs = [
        { value: 5.6, color: theme.colors.ic1, },
        { value: 4.3, color: theme.colors.ic2, },
        { value: 3.8, color: theme.colors.ic3, },
        { value: 2.6, color: theme.colors.ic4, },
        { value: 1.8, color: theme.colors.ic5, },
        { value: 0.9, color: theme.colors.ic6, },
        { value: 0.3, color: theme.colors.ic7, },
    ];

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split('T')[0];

            const response = await fetch(
                `${API_URL}/alerts?from=${today}&to=${today}`,
                { headers: { 'Authorization': `Bearer ${token}`, } }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error obteniendo alertas');
            }

            console.log('Alertas:', data);

            setAlerts(data.alerts);

        } catch (error) {
            console.error(error);
        }
    };

    const [modalCreateAlertVisible, setModalCreateAlertVisible] = useState(false);
    const [modalGenerateRouteVisible, setModalGenerateRouteVisible] = useState(false);

    const handleCreateAlert = (newAlert) => {
        // enviar aquí a la API

        setAlerts(prev => [newAlert, ...prev]);
        setModalCreateAlertVisible(false);
    };

    const handleGenerateRoute = (newRoute) => {
        // enviar aquí a la API

        setModalGenerateRouteVisible(false);
        navigation.navigate('Routes', {
            routeData: newRoute
        });
    };


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
                                <View style={[styles.sameRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <View style={styles.sameRow}>
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
                                    </View>
                                    <View style={styles.sameRow}>
                                        <Button
                                            title="Crear alerta"
                                            icon="exclamation"
                                            variant="primary"
                                            onPress={() => setModalCreateAlertVisible(true)}
                                        />
                                        <Button
                                            title="Generar ruta"
                                            icon="plus"
                                            variant="primary"
                                            onPress={() => setModalGenerateRouteVisible(true)}
                                        />
                                    </View>
                                </View>
                            </Card>
                        </View>

                        <View style={styles.mapContainer}>
                            <Map
                                showMarkers={true}
                                showDistricts={true}
                                alerts={alerts}
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
                    {alertsSelected && alerts.length > 0 && (
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
                                        icon="exclamation"
                                        description={item.description}
                                    >
                                        <Text style={styles.cardText}>Dirección: {item.address}</Text>

                                        {/* EXTRA  */}
                                        <Text style={styles.cardText}>
                                            Estado: {item.status}
                                        </Text>

                                        <Text style={styles.cardText}>
                                            Confirmaciones: {item.confirmations.length}
                                        </Text>

                                        <Text style={styles.cardText}>
                                            Descartes: {item.discards.length}
                                        </Text>
                                        {/* //  */}

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

                <CreateAlertModal
                    visible={modalCreateAlertVisible}
                    onClose={() => setModalCreateAlertVisible(false)}
                    onConfirm={handleCreateAlert}
                />

                <GenerateRouteModal
                    visible={modalGenerateRouteVisible}
                    onClose={() => setModalGenerateRouteVisible(false)}
                    onConfirm={handleGenerateRoute}
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
    mapControls: {
        marginBottom: 8,
    },
    map: {
        flex: 1,
        minHeight: 300,
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
