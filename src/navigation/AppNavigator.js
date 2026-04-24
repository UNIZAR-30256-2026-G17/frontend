import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { withProtection } from './ProtectedScreen';

import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/ciudadano/StatsScreen';
import { MapScreen } from '../screens/ciudadano/MapScreen';
import { LoginPoliceScreen } from '../screens/policia/LoginPoliceScreen';
import { RegisterScreen } from '../screens/policia/RegisterScreen';
import { CrimesScreen } from '../screens/policia/CrimesScreen';
import { RoutesScreen } from '../screens/ciudadano/RoutesScreen';
import { LoginAdminScreen } from '../screens/admin/LoginAdminScreen';
import { EstadisticasScreen } from '../screens/policia/EstadisticasScreen';
import { AdminUsuariosScreen } from '../screens/admin/AdminUsuariosScreen';
import { AdminDelitosScreen } from '../screens/admin/AdminDelitosScreen';
import { AdminAlertasScreen } from '../screens/admin/AdminAlertasScreen';

const Stack = createNativeStackNavigator();

// Pantallas protegidas — se crean fuera del componente para evitar re-renders
const AlertasAdminProtected   = withProtection(AdminAlertasScreen,  ['admin']);
const DelitosAdminProtected   = withProtection(AdminDelitosScreen,  ['admin']);
const UsersAdminProtected     = withProtection(AdminUsuariosScreen, ['admin']);
const EstadisticasProtected   = withProtection(EstadisticasScreen,  ['police']);
const CrimesProtected         = withProtection(CrimesScreen,        ['police']);

export default function AppNavigator() {
  const { loading } = useContext(AuthContext);

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
      {/* Públicas */}
      <Stack.Screen name="Home"        component={HomeScreen} />
      <Stack.Screen name="Map"         component={MapScreen} />
      <Stack.Screen name="Stats"       component={StatsScreen} />
      <Stack.Screen name="Routes"      component={RoutesScreen} />
      <Stack.Screen name="LoginAdmin"  component={LoginAdminScreen} />
      <Stack.Screen name="LoginPolice" component={LoginPoliceScreen} />
      <Stack.Screen name="Register"    component={RegisterScreen} />

      {/* Protegidas admin */}
      <Stack.Screen name="AlertasAdmin" component={AlertasAdminProtected} />
      <Stack.Screen name="DelitosAdmin" component={DelitosAdminProtected} />
      <Stack.Screen name="UsersAdmin"   component={UsersAdminProtected} />

      {/* Protegidas policía */}
      <Stack.Screen name="EstadisticasPolice" component={EstadisticasProtected} />
      <Stack.Screen name="Crimes"             component={CrimesProtected} />
    </Stack.Navigator>
  );
}