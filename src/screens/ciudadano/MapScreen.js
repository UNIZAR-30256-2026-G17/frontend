import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
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
import MapDistricts from '../../components/map/Map.districts.web';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';

import { geocodeAddress } from '../../utils/geocodeAddress';
import { API_URL } from '../../config/env';

const ICs = [
    { label: '> 28', color: theme.colors.ic1 },
    { label: '24 - 28', color: theme.colors.ic2 },
    { label: '19 - 24', color: theme.colors.ic3 },
    { label: '15 - 19', color: theme.colors.ic4 },
    { label: '10 - 15', color: theme.colors.ic5 },
    { label: '5 - 10', color: theme.colors.ic6 },
    { label: '< 5', color: theme.colors.ic7 },
];

export const MapScreen = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [token, setToken] = useState(null);
    const [districtICs, setDistrictICs] = useState([]);
    const [monthlyDistrictICs, setMonthlyDistrictICs] = useState([]);
    const [ICSelected, setICSelected] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [alertsSelected, setAlertsSelected] = useState(true);
    const [routePoints, setRoutePoints] = useState(null);

    const [screenLoading, setScreenLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({ visible: false, message: '' });
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

    const initAnonymousLogin = useCallback(async () => {
        try {
            setScreenLoading(true);
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                return;
            }

            const deviceId = await AsyncStorage.getItem('deviceId') || uuidv4();
            await AsyncStorage.setItem('deviceId', deviceId);

            const response = await fetch(`${API_URL}/auth/login/anonymous`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en login anónimo');

            await AsyncStorage.setItem('token', data.token);
            setToken(data.token);
        } catch (error) {
            console.error('Error anonymous login:', error);
            showSnackbar('Error de conexión anónima', 'error');
        } finally {
            setScreenLoading(false);
        }
    }, []);

    useEffect(() => {
        initAnonymousLogin();
    }, [initAnonymousLogin]);

    const showSnackbar = (message, variant = 'normal') =>
        setSnackbar({ visible: true, message, variant });

    const hideSnackbar = () =>
        setSnackbar(prev => ({ ...prev, visible: false }));

    const fetchDistrictsICsLastDay = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ic_district?time=day`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setDistrictICs(data.districtsICs);
        } catch (error) {
            console.error('Error ICs:', error);
        }
    }, [token]);

    const fetchDistrictsICsLastMonth = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ic_district?time=month`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) setMonthlyDistrictICs(data.districtsICs);
        } catch (error) {
            console.error('Error ICs mensuales:', error);
        }
    }, [token]);

    const fetchAlerts = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`${API_URL}/alerts?from=${today}&to=${today}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                const normalized = data.alerts.map(alert => ({
                    ...alert,
                    confirmations: alert.confirmations.length,
                    discards: alert.discards.length,
                }));
                setAlerts(normalized);
            }
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    const fetchAllData = useCallback(async () => {
        setScreenLoading(true);
        await Promise.all([
            fetchDistrictsICsLastDay(),
            fetchDistrictsICsLastMonth(),
            fetchAlerts()
        ]);
        setScreenLoading(false);
    }, [fetchDistrictsICsLastDay, fetchDistrictsICsLastMonth, fetchAlerts]);

    useEffect(() => {
        if (token) {
            fetchAllData();
        }
    }, [token, fetchAllData]);

    const confirmAlert = async (id) => {
        try {
            setActionLoading({ visible: true, message: 'Confirmando alerta...' });
            const response = await fetch(`${API_URL}/alerts/${id}/confirmations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Error confirmando alerta');
            setAlerts(prev => prev.map(alert => alert._id === id ? { ...alert, confirmations: alert.confirmations + 1, confirmedByMe: true, discardedByMe: false } : alert));
            showSnackbar('Alerta confirmada');
        } catch {
            showSnackbar('Error al confirmar', 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    const discardAlert = async (id) => {
        try {
            setActionLoading({ visible: true, message: 'Descartando alerta...' });
            const response = await fetch(`${API_URL}/alerts/${id}/discards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Error descartando alerta');
            setAlerts(prev => prev.map(alert => alert._id === id ? { ...alert, discards: alert.discards + 1, confirmedByMe: false, discardedByMe: true } : alert));
            showSnackbar('Alerta descartada');
        } catch {
            showSnackbar('Error al descartar', 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    const [modalCreateAlertVisible, setModalCreateAlertVisible] = useState(false);
    const [modalGenerateRouteVisible, setModalGenerateRouteVisible] = useState(false);

    const handleCreateAlert = async ({ description, address }) => {
        try {
            setActionLoading({ visible: true, message: 'Creando alerta...' });
            const response = await fetch(`${API_URL}/alerts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ description, address }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error creando alerta');

            const newAlert = { ...data.alert, confirmations: 0, discards: 0, confirmedByMe: false, discardedByMe: false };
            setAlerts(prev => [...prev, newAlert]);
            showSnackbar('La alerta ha sido creada correctamente');
            return newAlert;
        } catch (error) {
            showSnackbar('Error al crear alerta', 'error');
            throw error;
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    const handleGenerateRoute = async (routeData) => {
        try {
            setActionLoading({ visible: true, message: 'Calculando ruta...' });
            const { initialAddress, finalAddress } = routeData;
            if (!initialAddress || !finalAddress) throw new Error("Debes introducir origen y destino");

            const originCoords = await geocodeAddress(initialAddress);
            const destCoords = await geocodeAddress(finalAddress);
            if (!originCoords || !destCoords) throw new Error(`No se pudieron encontrar coordenadas`);

            setRoutePoints({ origin: originCoords, destination: destCoords });
            setModalGenerateRouteVisible(false);

            navigation.navigate('Rutas', {
                routeData: { initialAddress, finalAddress, originCoords, destCoords, districtICs: monthlyDistrictICs }
            });
        } catch (error) {
            showSnackbar(error.message, 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    if (screenLoading && alerts.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <AppLoading message="Cargando mapa..." />
            </View>
        );
    }

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>Mapa de Montgomery</Text>

                <View style={[styles.layoutContainer, isMobile && styles.layoutContainerMobile]}>
                    <View style={[styles.leftPanel, isMobile && styles.fullWidth]}>
                        <View style={styles.mapControls}>
                            <Card title="Condado de Montgomery, Maryland, EE.UU.">
                                <View style={[styles.sameRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <View style={styles.sameRow}>
                                        <Checkbox label="Criminalidad" defaultValue={ICSelected} onChange={setICSelected} />
                                        <Checkbox label="Alertas" defaultValue={alertsSelected} onChange={setAlertsSelected} />
                                    </View>
                                    <View style={styles.sameRow}>
                                        <Button title="Crear alerta" icon="exclamation" variant="primary" onPress={() => setModalCreateAlertVisible(true)} />
                                        <Button title="Generar ruta" icon="plus" variant="primary" onPress={() => setModalGenerateRouteVisible(true)} />
                                    </View>
                                </View>
                            </Card>
                        </View>

                        <View style={styles.mapContainer}>
                            <MapDistricts showMarkers={alertsSelected} showDistricts={ICSelected} markers={alerts} districtICs={districtICs} routePoints={routePoints} />
                        </View>

                        {ICSelected && (
                            <View style={styles.mapLegend}>
                                <Card title="Índice de criminalidad por distrito">
                                    <View style={styles.sameRow}>
                                        {ICs.map((ic, index) => (
                                            <View key={index} style={styles.sameRow}>
                                                <View style={[styles.icBox, { backgroundColor: ic.color }]} />
                                                <Text style={styles.cardText}>{ic.label}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </Card>
                            </View>
                        )}
                    </View>

                    {alertsSelected && alerts.length > 0 && (
                        <View style={[styles.rightPanel, isMobile && styles.fullWidth]}>
                            <FlatList
                                data={alerts}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.alertsContainer}
                                renderItem={({ item, index }) => {
                                    const isLocked = item.confirmedByMe || item.discardedByMe;
                                    return (
                                        <Card title={`Alerta ${index + 1}`} icon="exclamation" description={item.description}>
                                            <Text style={styles.cardText}>Dirección: {item.address}</Text>
                                            <Text style={styles.cardText}>Confirmaciones: {item.confirmations}</Text>
                                            <Text style={styles.cardText}>Descartes: {item.discards}</Text>
                                            <View style={styles.sameRow}>
                                                <Button title="Descartar" icon="trash" variant="danger" disabled={isLocked} onPress={() => discardAlert(item._id)} />
                                                <Button title="Confirmar" icon="check" variant="success" disabled={isLocked} onPress={() => confirmAlert(item._id)} />
                                            </View>
                                        </Card>
                                    )
                                }}
                            />
                        </View>
                    )}
                </View>

                <CreateAlertModal visible={modalCreateAlertVisible} onClose={() => setModalCreateAlertVisible(false)} onConfirm={handleCreateAlert} />
                <GenerateRouteModal visible={modalGenerateRouteVisible} onClose={() => setModalGenerateRouteVisible(false)} onConfirm={handleGenerateRoute} />
            </View>

            <LoadingOverlay visible={actionLoading.visible} message={actionLoading.message} />
            <AppSnackbar visible={snackbar.visible} message={snackbar.message} variant={snackbar.variant} onDismiss={hideSnackbar} />
        </Container>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, gap: 12 },
    loadingText: { color: theme.colors.textSecondary, fontSize: 14 },
    title: { ...theme.typography.pageTitle, color: theme.colors.text, marginTop: 16, alignSelf: 'center' },
    layoutContainer: { flex: 1, flexDirection: 'row', margin: 16, gap: 8 },
    layoutContainerMobile: { flexDirection: 'column' },
    leftPanel: { flex: 3, borderRadius: 16, overflow: 'hidden' },
    rightPanel: { flex: 1 },
    sameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    fullWidth: { flex: 1 },
    mapControls: { marginBottom: 8 },
    mapContainer: { flex: 1 },
    mapLegend: { marginTop: 8 },
    icBox: { width: 30, height: 20 },
    alertsContainer: { gap: 10 },
    cardText: { ...theme.typography.cardDescription, color: theme.colors.cardTextSecondary },
});
