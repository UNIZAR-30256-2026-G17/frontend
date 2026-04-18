import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';

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

export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
            <Stack.Screen name="Routes" component={RoutesScreen} />
            <Stack.Screen name="LoginPolice" component={LoginPoliceScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Crimes" component={CrimesScreen} />
            <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
            <Stack.Screen name="EstadisticasPolice" component={EstadisticasScreen} />
            <Stack.Screen name="UsersAdmin" component={AdminUsuariosScreen} />
            <Stack.Screen name="DelitosAdmin" component={AdminDelitosScreen} />
            <Stack.Screen name="AlertasAdmin" component={AdminAlertasScreen} />



        </Stack.Navigator>
    );
}
