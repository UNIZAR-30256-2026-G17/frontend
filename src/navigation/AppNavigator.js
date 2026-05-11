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
      }}
    >
      {!user ? (
        <>
          {/* Públicas */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
          <Stack.Screen name="Routes" component={RoutesScreen} />

          <Stack.Screen name="Login"      component={LoginScreen} /> 
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === 'admin' ? (
        <>
          {/* Protegidas admin */}
          <Stack.Screen name="AlertasAdmin" component={AlertasAdminProtected} />
          <Stack.Screen name="DelitosAdmin" component={DelitosAdminProtected} />
          <Stack.Screen name="UsersAdmin" component={UsersAdminProtected} />
        </>
      ) : (
        <>
          {/* Protegidas policía */}
          <Stack.Screen name="MapPolice" component={MapPoliceProtected} />
          <Stack.Screen name="StatsPolice" component={EstadisticasProtected} />
          <Stack.Screen name="CrimesPolice" component={CrimesProtected} />
          <Stack.Screen name="AlertsPolice" component={AlertsPoliceProtected} />
          <Stack.Screen name="RoutesPolice" component={RoutesPoliceProtected} />
        </>
      )}
    </Stack.Navigator>
  );
}
