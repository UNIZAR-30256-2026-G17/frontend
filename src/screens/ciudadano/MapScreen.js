/**
 * @file MapScreen.js
 * @description Pantalla principal para ciudadanos. Muestra un mapa con distritos, 
 * índices de criminalidad (IC) y alertas activas. Permite crear alertas y generar rutas.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesome } from '@expo/vector-icons';
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
import AlertCard from '../../components/ui/AlertCard';
import { SummaryCards } from '../../components/ui/SummaryCards';

import { geocodeAddress } from '../../utils/geocodeAddress';
import { API_URL } from '../../config/env';

// Rangos de Índice de Criminalidad (IC) y sus colores
const ICs = [
    { label: '> 28', color: theme.colors.ic1 },
    { label: '24 - 28', color: theme.colors.ic2 },
    { label: '19 - 24', color: theme.colors.ic3 },
    { label: '15 - 19', color: theme.colors.ic4 },
    { label: '10 - 15', color: theme.colors.ic5 },
    { label: '5 - 10', color: theme.colors.ic6 },
    { label: '< 5', color: theme.colors.ic7 },
];

/**
 * Construye el resumen de alertas para las SummaryCards
 * @param {Array} alerts - Lista de alertas actuales
 */
const buildAlertSummary = (alerts) => [
    { icon: 'warning', label: 'Total alertas', value: alerts.length, color: theme.colors.warning },
    { icon: 'clock-o', label: 'Sin responder', value: alerts.filter(a => !a.confirmedByMe && !a.discardedByMe).length, color: '#ffffff' },
    { icon: 'check-circle', label: 'Confirmadas', value: alerts.filter(a => a.confirmedByMe).length, color: theme.colors.success },
    { icon: 'times-circle', label: 'Descartadas', value: alerts.filter(a => a.discardedByMe).length, color: theme.colors.danger },
];

/**
 * Componente MapScreen
 */
export const MapScreen = () => {
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const isMobile = width < 768;
    const mapHeight = isMobile ? Math.round(height * 0.48) : undefined;

    // Estado para controlar la vista en móvil (mapa vs listado de alertas)
    const [mobileView, setMobileView] = useState('map');

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

    const [modalCreateAlertVisible, setModalCreateAlertVisible] = useState(false);
    const [modalGenerateRouteVisible, setModalGenerateRouteVisible] = useState(false);

    /**
     * Realiza el login anónimo si no hay un token guardado
     */
    const initAnonymousLogin = useCallback(async () => {
        try {
            setScreenLoading(true);
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) { setToken(storedToken); return; }

            const deviceId = await AsyncStorage.getItem('deviceId') || uuidv4();
            await AsyncStorage.setItem('deviceId', deviceId);

            const response = await fetch(`${API_URL}/auth/login/anonymous`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId }),
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

    // Inicialización de login anónimo
    useEffect(() => {
        initAnonymousLogin();
    }, [initAnonymousLogin]);

    /**
     * Muestra un mensaje en el snackbar
     */
    const showSnackbar = (message, variant = 'normal') =>
        setSnackbar({ visible: true, message, variant });

    /**
     * Oculta el snackbar
     */
    const hideSnackbar = () =>
        setSnackbar(prev => ({ ...prev, visible: false }));

    /**
     * Obtiene los ICs del último día
     */
    const fetchDistrictsICsLastDay = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ic_district?time=day`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) setDistrictICs(data.districtsICs);
        } catch (error) {
            console.error('Error ICs:', error);
        }
    }, [token]);

    /**
     * Obtiene los ICs del último mes (para rutas)
     */
    const fetchDistrictsICsLastMonth = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ic_district?time=month`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) setMonthlyDistrictICs(data.districtsICs);
        } catch (error) {
            console.error('Error ICs mensuales:', error);
        }
    }, [token]);

    /**
     * Obtiene las alertas del día de hoy
     */
    const fetchAlerts = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`${API_URL}/alerts?from=${today}&to=${today}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                const normalized = data.alerts.map(alert => ({
                    ...alert,
                    confirmations: alert.confirmations.length,
                    discards: alert.discards.length,
                    confirmedByMe: false,
                    discardedByMe: false,
                }));
                setAlerts(normalized);
            }
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    /**
     * Obtiene todos los datos necesarios (ICs y alertas)
     */
    const fetchAllData = useCallback(async () => {
        setScreenLoading(true);
        await Promise.all([
            fetchDistrictsICsLastDay(),
            fetchDistrictsICsLastMonth(),
            fetchAlerts()
        ]);
        setScreenLoading(false);
    }, [fetchDistrictsICsLastDay, fetchDistrictsICsLastMonth, fetchAlerts]);

    // Carga todos los datos una vez que se tiene el token
    useEffect(() => {
        if (token) {
            fetchAllData();
        }
    }, [token, fetchAllData]);

    /**
     * Confirma una alerta
     * @param {String} id - ID de la alerta
     */
    const confirmAlert = async (id) => {
        try {
            setActionLoading({ visible: true, message: 'Confirmando alerta...' });
            const response = await fetch(`${API_URL}/alerts/${id}/confirmations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error();
            setAlerts(prev => prev.map(a =>
                a._id === id
                    ? { ...a, confirmations: a.confirmations + 1, confirmedByMe: true, discardedByMe: false }
                    : a
            ));
            showSnackbar('Alerta confirmada');
        } catch {
            showSnackbar('Error al confirmar', 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    /**
     * Descarta una alerta
     * @param {String} id - ID de la alerta
     */
    const discardAlert = async (id) => {
        try {
            setActionLoading({ visible: true, message: 'Descartando alerta...' });
            const response = await fetch(`${API_URL}/alerts/${id}/discards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error();
            setAlerts(prev => prev.map(a =>
                a._id === id
                    ? { ...a, discards: a.discards + 1, confirmedByMe: false, discardedByMe: true }
                    : a
            ));
            showSnackbar('Alerta descartada');
        } catch {
            showSnackbar('Error al descartar', 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    /**
     * Maneja la creación de una nueva alerta
     */
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

            const newAlert = {
                ...data.alert,
                confirmations: 0,
                discards: 0,
                confirmedByMe: false,
                discardedByMe: false,
            };
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

    /**
     * Maneja la generación de una ruta segura
     */
    const handleGenerateRoute = async (routeData) => {
        try {
            setActionLoading({ visible: true, message: 'Calculando ruta...' });
            const { initialAddress, finalAddress } = routeData;
            if (!initialAddress || !finalAddress) throw new Error('Debes introducir origen y destino');

            const originCoords = await geocodeAddress(initialAddress);
            const destCoords = await geocodeAddress(finalAddress);
            if (!originCoords || !destCoords) throw new Error('No se pudieron encontrar coordenadas');

            setRoutePoints({ origin: originCoords, destination: destCoords });
            setModalGenerateRouteVisible(false);

            navigation.navigate('Rutas', {
                routeData: {
                    initialAddress,
                    finalAddress,
                    originCoords,
                    destCoords,
                    districtICs: monthlyDistrictICs,
                },
            });
        } catch (error) {
            showSnackbar(error.message, 'error');
        } finally {
            setActionLoading({ visible: false, message: '' });
        }
    };

    // ─── Loading inicial ─────────────────────────────────────────────────────
    if (screenLoading && alerts.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <AppLoading message="Cargando mapa..." />
            </View>
        );
    }

    // ─── Vista móvil: ALERTAS ────────────────────────────────────────────────
    if (isMobile && mobileView === 'alerts') {
        return (
            <Container>
                <View style={styles.container}>
                    <View style={styles.mobileAlertsHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setMobileView('map')}
                        >
                            <FontAwesome name="arrow-left" size={16} color={theme.colors.text} />
                            <Text style={styles.backButtonText}>Volver al mapa</Text>
                        </TouchableOpacity>
                        <Text style={styles.mobileAlertsTitle}>
                            Alertas de hoy ({alerts.length})
                        </Text>
                    </View>

                    {alerts.length === 0 ? (
                        <View style={styles.emptyAlerts}>
                            <FontAwesome name="bell-slash" size={40} color={theme.colors.textSecondary} />
                            <Text style={styles.emptyAlertsText}>No hay alertas hoy</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={alerts}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.alertsListContent}
                            renderItem={({ item }) => (
                                <AlertCard
                                    alert={item}
                                    isMobile={true}
                                    onConfirm={confirmAlert}
                                    onDiscard={discardAlert}
                                />
                            )}
                        />
                    )}
                </View>

                <LoadingOverlay visible={actionLoading.visible} message={actionLoading.message} />
                <AppSnackbar
                    visible={snackbar.visible}
                    message={snackbar.message}
                    variant={snackbar.variant}
                    onDismiss={hideSnackbar}
                />
            </Container>
        );
    }

    // ─── Vista móvil: MAPA  /  Desktop completo ──────────────────────────────
    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>Mapa de Montgomery</Text>

                <View style={[styles.layoutContainer, isMobile && styles.layoutContainerMobile]}>

                    {/* ── Panel izquierdo móvil: ScrollView ── */}
                    {isMobile ? (
                        <ScrollView
                            style={styles.fullWidth}
                            contentContainerStyle={styles.leftPanelMobileContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Controles */}
                            <View style={styles.mapControls}>
                                <Card title="Condado de Montgomery, Maryland, EE.UU.">
                                    <View style={styles.sameRow}>
                                        <Checkbox label="Criminalidad" defaultValue={ICSelected} onChange={setICSelected} />
                                        <Checkbox label="Alertas" defaultValue={alertsSelected} onChange={setAlertsSelected} />
                                    </View>
                                    <View style={[styles.sameRow, styles.buttonsRow]}>
                                        <Button
                                            title="Crear alerta"
                                            icon="exclamation"
                                            variant="primary"
                                            style={styles.buttonFlex}
                                            onPress={() => setModalCreateAlertVisible(true)}
                                        />
                                        <Button
                                            title="Generar ruta"
                                            icon="plus"
                                            variant="primary"
                                            style={styles.buttonFlex}
                                            onPress={() => setModalGenerateRouteVisible(true)}
                                        />
                                    </View>
                                </Card>
                            </View>

                            {/* Tarjetillas resumen debajo del mapa */}
                            {alertsSelected && alerts.length > 0 && (
                                <SummaryCards data={buildAlertSummary(alerts)} />
                            )}

                            {/* Mapa — altura fija, no puede crecer */}
                            <View style={{ height: mapHeight }}>
                                <MapDistricts
                                    showMarkers={alertsSelected}
                                    showDistricts={ICSelected}
                                    markers={alerts}
                                    districtICs={districtICs}
                                    routePoints={routePoints}
                                />
                            </View>

                            {/* Leyenda */}
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

                            {/* Botón ver listado */}
                            {alertsSelected && alerts.length > 0 && (
                                <TouchableOpacity
                                    style={styles.viewAlertsButton}
                                    onPress={() => setMobileView('alerts')}
                                >
                                    <FontAwesome name="list" size={16} color={theme.colors.buttonText ?? '#000'} />
                                    <Text style={styles.viewAlertsButtonText}>
                                        Ver listado de alertas ({alerts.length})
                                    </Text>
                                    <FontAwesome name="chevron-right" size={14} color={theme.colors.buttonText ?? '#000'} />
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                    ) : (

                        /* ── Panel izquierdo desktop: View con flex ── */
                        <View style={styles.leftPanel}>
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
                                <MapDistricts
                                    showMarkers={alertsSelected}
                                    showDistricts={ICSelected}
                                    markers={alerts}
                                    districtICs={districtICs}
                                    routePoints={routePoints}
                                />
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
                    )}

                    {/* ── Panel derecho: alertas desktop ── */}
                    {!isMobile && alertsSelected && alerts.length > 0 && (
                        <View style={styles.rightPanel}>
                            <FlatList
                                data={alerts}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={styles.alertsListContent}
                                renderItem={({ item }) => (
                                    <AlertCard
                                        alert={item}
                                        isMobile={false}
                                        onConfirm={confirmAlert}
                                        onDiscard={discardAlert}
                                    />
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

            <LoadingOverlay visible={actionLoading.visible} message={actionLoading.message} />
            <AppSnackbar
                visible={snackbar.visible}
                message={snackbar.message}
                variant={snackbar.variant}
                onDismiss={hideSnackbar}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background, gap: theme.spacing.md },
    title: { ...theme.typography.pageTitle, color: theme.colors.text, marginTop: theme.spacing.lg, alignSelf: 'center' },

    layoutContainer: { flex: 1, flexDirection: 'row', margin: theme.spacing.lg, gap: theme.spacing.sm },
    layoutContainerMobile: { flexDirection: 'column' },

    leftPanel: { flex: 3, borderRadius: theme.radii.lg },
    rightPanel: { flex: 1 },
    fullWidth: { flex: 1 },

    leftPanelMobileContent: { gap: theme.spacing.sm, paddingBottom: theme.spacing.xl },

    sameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    buttonsRow: { marginTop: theme.spacing.sm },
    buttonFlex: { flex: 1 },

    mapControls: {},
    mapContainer: { flex: 1 },

    icBox: { width: 30, height: 20 },
    cardText: { ...theme.typography.cardDescription, color: theme.colors.cardTextSecondary },

    alertsListContent: { gap: 10, padding: 4 },

    viewAlertsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.primary,
    },
    viewAlertsButtonText: {
        flex: 1,
        color: theme.colors.buttonText ?? '#000',
        fontSize: 15,
        fontWeight: '600',
    },

    mobileAlertsHeader: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        alignSelf: 'flex-start',
        paddingVertical: 6,
    },
    backButtonText: {
        color: theme.colors.text,
        fontSize: 14,
    },
    mobileAlertsTitle: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        fontSize: 20,
    },
    emptyAlerts: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
        paddingTop: 60,
    },
    emptyAlertsText: {
        color: theme.colors.textSecondary,
        fontSize: 15,
    },
});

export default MapScreen;