import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

const linking = {
  prefixes: ['http://localhost:3000'], // añadir aquí el futuro dominio
  config: {
    screens: {
      Home: '',
      Map: 'map',
      Stats: 'stats',
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
