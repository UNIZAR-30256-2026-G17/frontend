/**
 * @file MapPoliceScreen.js
 * @description Pantalla del mapa táctico para el personal policial.
 * Permite visualizar el Índice de Criminalidad (IC) por beat y generar rutas de patrullaje optimizadas.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import MapBeats from '../../components/map/Map.beats.web';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import AppLoading from '../../components/ui/AppLoading';
import AppSnackbar from '../../components/ui/AppSnackBar';

import GenerateRoutesModal from './GenerateRoutesModal';
import { generatePatrolRoutes } from '../../utils/routeGenerator';

import { API_URL } from '../../config/env';

// Definición de colores según el Índice de Criminalidad (IC)
const ICs = [
    { label: '> 5', color: theme.colors.ic1 },
    { label: '4 - 5', color: theme.colors.ic2 },
    { label: '3.5 - 4', color: theme.colors.ic3 },
    { label: '3 - 3.5', color: theme.colors.ic4 },
    { label: '2.5 - 3', color: theme.colors.ic5 },
    { label: '2 - 2.5', color: theme.colors.ic6 },
    { label: '< 2', color: theme.colors.ic7 },
];

/**
 * Componente MapPoliceScreen
 */
export const MapPoliceScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const navigation = useNavigation();

    const [ICSelected, setICSelected] = useState(true);
    const [beatICs, setBeatICs] = useState([]);
    const [loadingMap, setLoadingMap] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', variant: 'normal' });

    const [modalGenerateRoutesVisible, setModalGenerateRoutesVisible] = useState(false);

    /**
     * Obtiene los ICs de los beats para las últimas 24 horas desde la API
     */
    const fetchBeatsICsLastDay = useCallback(async () => {
        try {
            setLoadingMap(true);
            const response = await fetch(
                `${API_URL}/ic_beat?time=day`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error obteniendo ICs');
            }

            setBeatICs(data.beatsICs);

        } catch (error) {
            console.error('Error ICs:', error);
            showSnackbar('Error al cargar datos del mapa', 'error');
        } finally {
            setLoadingMap(false);
        }
    }, [user?.token]);

    // Cargar los ICs de los beats al iniciar la pantalla
    useEffect(() => {
        if (user?.token) {
            fetchBeatsICsLastDay();
        }
    }, [user, fetchBeatsICsLastDay]);

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
     * Maneja la generación de rutas de patrullaje tácticas
     * @param {Object} data - Datos del modal de generación { numPatrullas }
     */
    const handleGenerateRoutes = async (data) => {
        const n = parseInt(data.numPatrullas);

        try {
            setActionLoading(true);
            if (beatICs.length === 0) throw new Error("No hay datos de IC cargados");

            const routes = await generatePatrolRoutes(n, beatICs);
            const validRoutes = routes.filter(r => r.path !== null);

            setModalGenerateRoutesVisible(false);

            // Redirigir a la pantalla de visualización de rutas con los datos generados
            navigation.navigate('Rutas de Patrullaje', {
                isMultiple: true,
                routes: validRoutes,
                count: n
            });

        } catch (error) {
            setModalGenerateRoutesVisible(false);
            console.error("Error al generar patrullas:", error);
            showSnackbar('Error al generar las rutas', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Spinner mientras se carga el mapa o se verifica la sesión
    if (authLoading || (loadingMap && beatICs.length === 0)) {
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

                <View style={styles.layoutContainer}>
                    <View style={styles.buttonRightContainer}>
                        <Button
                            title="Generar rutas de patrullaje"
                            icon="plus"
                            variant="primary"
                            onPress={() => setModalGenerateRoutesVisible(true)}
                        />
                    </View>

                    <View>
                        <Card title="Condado de Montgomery, Maryland, EE.UU.">
                            <View style={styles.sameRow}>
                                <Checkbox
                                    label="Índice de criminalidad por beat"
                                    defaultValue={ICSelected}
                                    onChange={setICSelected}
                                />
                            </View>
                        </Card>
                    </View>

                    <View style={styles.mapContainer}>
                        <MapBeats
                            showBeats={ICSelected}
                            beatICs={beatICs}
                        />
                    </View>

                    {/* Leyenda del IC */}
                    {ICSelected && (
                        <Card title="Índice de criminalidad">
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

                {/* Modal para configurar la generación de rutas */}
                <GenerateRoutesModal
                    visible={modalGenerateRoutesVisible}
                    onClose={() => setModalGenerateRoutesVisible(false)}
                    onConfirm={handleGenerateRoutes}
                />
            </View>

            <LoadingOverlay visible={actionLoading} message="Generando rutas..." />
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
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        gap: theme.spacing.md,
    },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
        alignSelf: 'center',
    },
    layoutContainer: {
        flex: 1,
        margin: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    buttonRightContainer: {
        alignItems: 'flex-end',
    },
    sameRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    mapContainer: {
        flex: 1,
    },
    icBox: {
        width: 30,
        height: 20,
        borderRadius: theme.radii.xs,
    },
    cardText: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardTextSecondary,
    },
});
