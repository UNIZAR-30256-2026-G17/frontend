import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  JetBrainsMono_400Regular
} from '@expo-google-fonts/jetbrains-mono';

import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ScrollProvider } from './src/context/ScrollContext';
import { paperTheme } from './src/theme';

const linking = {
  prefixes: ['http://localhost:8081', 'http://localhost:3000'],
  config: {
    screens: {
      Home: '',
      Map: 'map',
      Stats: 'stats',
      Routes: 'routes',
      Login: 'login',
      Register: 'register',
      CrimesPolice: 'policia/delitos',
      StatsPolice: 'policia/estadisticas',
      MapPolice: 'policia/map',
      AlertsPolice: 'policia/alerts',
      RoutesPolice: 'policia/routes',
      AlertasAdmin: 'admin/alertas',
      DelitosAdmin: 'admin/delitos',
      UsersAdmin: 'admin/usuarios',
    },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlusJakarta-Bold': PlusJakartaSans_700Bold,
    'PlusJakarta-ExtraBold': PlusJakartaSans_800ExtraBold,
    'JetBrains-Mono': JetBrainsMono_400Regular,
  });

  if (!fontsLoaded) {
    return null; // O un splash screen si tuvieras
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AuthProvider>
          <ScrollProvider>
            <NavigationContainer linking={linking}>
              <AppNavigator />
            </NavigationContainer>
          </ScrollProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
