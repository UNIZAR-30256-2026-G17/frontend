import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { withProtection } from './ProtectedScreen';

import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/ciudadano/StatsScreen';
import { MapScreen } from '../screens/ciudadano/MapScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/policia/RegisterScreen';
import { CrimesScreen } from '../screens/policia/CrimesScreen';
import { RoutesScreen } from '../screens/ciudadano/RoutesScreen';
import { MapPoliceScreen } from '../screens/policia/MapPoliceScreen';
import { AlertsScreen } from '../screens/policia/AlertsScreen';
import { EstadisticasScreen } from '../screens/policia/EstadisticasScreen';
import { AdminUsuariosScreen } from '../screens/admin/AdminUsuariosScreen';
import { AdminDelitosScreen } from '../screens/admin/AdminDelitosScreen';
import { AdminAlertasScreen } from '../screens/admin/AdminAlertasScreen';
import { RoutesPoliceScreen } from '../screens/policia/RoutesPoliceScreen';

const Stack = createNativeStackNavigator();

// Pantallas protegidas — se crean fuera del componente para evitar re-renders
const AlertasAdminProtected = withProtection(AdminAlertasScreen, ['admin']);
const DelitosAdminProtected = withProtection(AdminDelitosScreen, ['admin']);
const UsersAdminProtected = withProtection(AdminUsuariosScreen, ['admin']);
const EstadisticasProtected = withProtection(EstadisticasScreen, ['police']);
const CrimesProtected = withProtection(CrimesScreen, ['police']);
const MapPoliceProtected = withProtection(MapPoliceScreen, ['police']);
const AlertsPoliceProtected = withProtection(AlertsScreen, ['police']);
const RoutesPoliceProtected = withProtection(RoutesPoliceScreen, ['police']);

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'fade_from_bottom',
        animationDuration: 300,
      }}
    >
      {!user ? (
        <>
          {/* Públicas */}
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Mapa" component={MapScreen} />
          <Stack.Screen name="Estadísticas" component={StatsScreen} />
          <Stack.Screen name="Rutas" component={RoutesScreen} />

          <Stack.Screen name="Iniciar Sesión" component={LoginScreen} /> 
          <Stack.Screen name="Registro" component={RegisterScreen} />
        </>
      ) : user.role === 'admin' ? (
        <>
          {/* Protegidas admin */}
          <Stack.Screen name="Panel de Alertas" component={AlertasAdminProtected} />
          <Stack.Screen name="Panel de Delitos" component={DelitosAdminProtected} />
          <Stack.Screen name="Panel de Usuarios" component={UsersAdminProtected} />
        </>
      ) : (
        <>
          {/* Protegidas policía */}
          <Stack.Screen name="Mapa Policial" component={MapPoliceProtected} />
          <Stack.Screen name="Estadísticas Policiales" component={EstadisticasProtected} />
          <Stack.Screen name="Listado de Delitos" component={CrimesProtected} />
          <Stack.Screen name="Gestión de Alertas" component={AlertsPoliceProtected} />
          <Stack.Screen name="Rutas de Patrullaje" component={RoutesPoliceProtected} />
        </>
      )}
    </Stack.Navigator>
  );
}
