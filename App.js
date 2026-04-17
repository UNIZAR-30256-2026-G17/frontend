import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

const linking = {
  prefixes: ['http://localhost:3000'], // añadir aquí el futuro dominio
  config: {
    screens: {
      Home: '',
      Map: 'map',
      Stats: 'stats',
      Login: 'login',
      Register: 'register',
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
