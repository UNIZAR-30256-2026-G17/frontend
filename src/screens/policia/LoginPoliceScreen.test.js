import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoginPoliceScreen } from './LoginPoliceScreen';
import { AuthProvider } from '../../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

// Mock de navegación
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
    useNavigationState: jest.fn(),
  };
});

// Mock de Header
jest.mock('../../components/layout/Header', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Header: () => React.createElement(Text, null, 'Mock Header'),
  };
});

describe('LoginPoliceScreen', () => {
  it('renders correctly with all basic elements', () => {
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <NavigationContainer>
          <AuthProvider>
            <LoginPoliceScreen />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    // Verificar que el título de la pantalla está presente (usamos getAllByText porque aparece en el título y en el botón)
    expect(screen.getAllByText('Iniciar sesión').length).toBeGreaterThan(0);
    
    // Verificar que el nombre de la institución está presente
    expect(screen.getByText('Policía de Montgomery')).toBeTruthy();

    // Verificar que existen los botones
    expect(screen.getByText('Registrarse')).toBeTruthy();
  });
});
