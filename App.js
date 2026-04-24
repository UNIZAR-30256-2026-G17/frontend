import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/context/AuthContext';

import AppNavigator from './src/navigation/AppNavigator';

const linking = {
  prefixes: ['http://localhost:8081', 'http://localhost:3000'],
  config: {
    screens: {
      Home: '',
      Map: 'map',
      Stats: 'stats',
      Routes: 'routes',
      LoginAdmin: 'login/admin',
      LoginPolice: 'login/policia',
      Register: 'register',
      Crimes: 'policia/delitos',
      EstadisticasPolice: 'policia/estadisticas',
      AlertasAdmin: 'admin/alertas',
      DelitosAdmin: 'admin/delitos',
      UsersAdmin: 'admin/usuarios',
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
