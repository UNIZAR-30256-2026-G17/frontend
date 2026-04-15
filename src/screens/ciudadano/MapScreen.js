import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useWindowDimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
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

    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

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
        initAnonymousLogin();
    }, []);

    const initAnonymousLogin = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                return;
            }

            const deviceId = await AsyncStorage.getItem('deviceId');
            let finalDeviceId = deviceId;
            if (!finalDeviceId) {
                finalDeviceId = uuidv4();
                await AsyncStorage.setItem('deviceId', finalDeviceId);
            }

            const response = await fetch(`${API_URL}/auth/login/anonymous`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceId: finalDeviceId })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error en login anónimo');
            }

            await AsyncStorage.setItem('token', data.token);
            setToken(data.token);

        } catch (error) {
            console.error('Error anonymous login:', error);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [token]);

    const fetchAlerts = async () => {
        try {
            if (!token) return;

            const today = new Date().toISOString().split('T')[0];

            const response = await fetch(
                `${API_URL}/alerts?from=${today}&to=${today}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error obteniendo alertas');
            }

            const normalized = data.alerts.map(alert => ({
                ...alert,
                confirmations: alert.confirmations.length,
                discards: alert.discards.length,
            }));

            setAlerts(normalized);

        } catch (error) {
            console.error(error);
        }
    };

    const confirmAlert = async (id) => {
        try {

            const response = await fetch(`${API_URL}/alerts/${id}/confirmations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error confirmando alerta');

            setAlerts(prev =>
                prev.map(alert =>
                    alert._id === id
                        ? {
                            ...alert,
                            confirmations: alert.confirmations + 1,
                            discards: alert.discards,
                            confirmedByMe: true,
                            discardedByMe: false,
                        }
                        : alert
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const discardAlert = async (id) => {
        try {
            const response = await fetch(`${API_URL}/alerts/${id}/discards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error descartando alerta');

            setAlerts(prev =>
                prev.map(alert =>
                    alert._id === id
                        ? {
                            ...alert,
                            confirmations: alert.confirmations,
                            discards: alert.discards + 1,
                            confirmedByMe: false,
                            discardedByMe: true,
                        }
                        : alert
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const [modalCreateAlertVisible, setModalCreateAlertVisible] = useState(false);
    const [modalGenerateRouteVisible, setModalGenerateRouteVisible] = useState(false);

    const handleCreateAlert = async ({ description, address }) => {
        try {
            const response = await fetch(`${API_URL}/alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description,
                    address,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error creando alerta');
            }

            // actualizar estado local
            setAlerts(prev => [...prev, data.alert]);

            return data.alert;

        } catch (error) {
            console.error('Error creando alerta:', error.message);
            throw error;
        }
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
                                showMarkers={alertsSelected}
                                showDistricts={ICSelected}
                                markers={alerts}
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
                                renderItem={({ item, index }) => {
                                    const isLocked = item.confirmedByMe || item.discardedByMe;
                                    return (
                                        <Card
                                            title={`Alerta ${index + 1}`}
                                            icon="exclamation"
                                            description={item.description}
                                        >
                                            <Text style={styles.cardText}>Dirección: {item.address}</Text>

                                            <Text style={styles.cardText}>
                                                Confirmaciones: {item.confirmations}
                                            </Text>

                                            <Text style={styles.cardText}>
                                                Descartes: {item.discards}
                                            </Text>

                                            <View style={styles.sameRow}>
                                                <Button
                                                    title="Descartar"
                                                    icon="trash"
                                                    variant="danger"
                                                    disabled={isLocked}
                                                    onPress={() => discardAlert(item._id)}
                                                />
                                                <Button
                                                    title="Confirmar"
                                                    icon="check"
                                                    variant="success"
                                                    disabled={isLocked}
                                                    onPress={() => confirmAlert(item._id)}
                                                />
                                            </View>
                                        </Card>
                                    )
                                }}
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
