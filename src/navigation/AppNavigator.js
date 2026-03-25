import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';

import { HomeScreen } from '../screens/HomeScreen';
import { StatsScreen } from '../screens/ciudadano/StatsScreen';
import { MapScreen } from '../screens/ciudadano/MapScreen';
import { RoutesScreen } from '../screens/ciudadano/RoutesScreen';


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
        </Stack.Navigator>
    );
}
