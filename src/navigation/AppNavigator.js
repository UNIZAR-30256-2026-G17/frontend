/**
 * @file AppNavigator.js
 * @description Navegador principal de la aplicación.
 * Define las rutas públicas y protegidas basándose en el estado de autenticación y el rol del usuario.
 */

import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { withProtection } from './ProtectedScreen';

// Pantallas Ciudadano / Públicas
import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/ciudadano/StatsScreen';
import { MapScreen } from '../screens/ciudadano/MapScreen';
import { RoutesScreen } from '../screens/ciudadano/RoutesScreen';

// Pantallas Autenticación
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/policia/RegisterScreen';

// Pantallas Policía
import { CrimesScreen } from '../screens/policia/CrimesScreen';
import { MapPoliceScreen } from '../screens/policia/MapPoliceScreen';
import { AlertsScreen } from '../screens/policia/AlertsScreen';
import { EstadisticasScreen } from '../screens/policia/EstadisticasScreen';
import { RoutesPoliceScreen } from '../screens/policia/RoutesPoliceScreen';

// Pantallas Administrador
import { AdminUsuariosScreen } from '../screens/admin/AdminUsuariosScreen';
import { AdminDelitosScreen } from '../screens/admin/AdminDelitosScreen';
import { AdminAlertasScreen } from '../screens/admin/AdminAlertasScreen';

const Stack = createNativeStackNavigator();

// ─── PANTALLAS PROTEGIDAS ───
// Se envuelven en el HOC withProtection para validar el rol antes de permitir el acceso.
const AlertasAdminProtected = withProtection(AdminAlertasScreen, ['admin']);
const DelitosAdminProtected = withProtection(AdminDelitosScreen, ['admin']);
const UsersAdminProtected = withProtection(AdminUsuariosScreen, ['admin']);
const EstadisticasProtected = withProtection(EstadisticasScreen, ['police']);
const CrimesProtected = withProtection(CrimesScreen, ['police']);
const MapPoliceProtected = withProtection(MapPoliceScreen, ['police']);
const AlertsPoliceProtected = withProtection(AlertsScreen, ['police']);
const RoutesPoliceProtected = withProtection(RoutesPoliceScreen, ['police']);

/**
 * Componente AppNavigator
 */
export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  // Mientras se recupera la sesión, mostramos un cargador
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
          {/* RUTAS PÚBLICAS (No autenticado) */}
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Mapa" component={MapScreen} />
          <Stack.Screen name="Estadísticas" component={StatsScreen} />
          <Stack.Screen name="Rutas" component={RoutesScreen} />

          <Stack.Screen name="Iniciar Sesión" component={LoginScreen} /> 
          <Stack.Screen name="Registro" component={RegisterScreen} />
        </>
      ) : user.role === 'admin' ? (
        <>
          {/* RUTAS ADMINISTRADOR */}
          <Stack.Screen name="Panel de Alertas" component={AlertasAdminProtected} />
          <Stack.Screen name="Panel de Delitos" component={DelitosAdminProtected} />
          <Stack.Screen name="Panel de Usuarios" component={UsersAdminProtected} />
        </>
      ) : (
        <>
          {/* RUTAS POLICÍA */}
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
