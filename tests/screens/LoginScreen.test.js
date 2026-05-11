import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/LoginScreen';
import { AuthProvider } from '../../src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock de navegación
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
  }),
}));

// Mock de fetch global
global.fetch = jest.fn();

// Mock de Alert
jest.spyOn(Alert, 'alert');

const renderLoginScreen = () => {
  return render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <NavigationContainer>
        <AuthProvider>
          <LoginScreen />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('se renderiza correctamente con todos los elementos básicos', () => {
    renderLoginScreen();
    
    expect(screen.getAllByText('Iniciar sesión').length).toBe(2);
    expect(screen.getByPlaceholderText('ejemplo@gmail.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ejemplo123@')).toBeTruthy();
    
    // Verificar botones
    expect(screen.getByText('Registrarse')).toBeTruthy();
  });

  it('muestra un error si los campos están vacíos', async () => {
    renderLoginScreen();
    
    const loginButton = screen.getAllByText('Iniciar sesión')[1];
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Todos los campos son obligatorios');
    });
  });

  it('inicia sesión con éxito como policía y navega a MapPolice', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        user: { email: 'test@police.com', role: 'police' }
      }),
    });

    renderLoginScreen();
    
    fireEvent.changeText(screen.getByPlaceholderText('ejemplo@gmail.com'), 'test@police.com');
    fireEvent.changeText(screen.getByPlaceholderText('Ejemplo123@'), 'password123');
    fireEvent.press(screen.getAllByText('Iniciar sesión')[1]);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('MapPolice');
    });
  });

  it('inicia sesión con éxito como admin y navega a AlertasAdmin', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        user: { email: 'admin@test.com', role: 'admin' }
      }),
    });

    renderLoginScreen();
    
    fireEvent.changeText(screen.getByPlaceholderText('ejemplo@gmail.com'), 'admin@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Ejemplo123@'), 'password123');
    fireEvent.press(screen.getAllByText('Iniciar sesión')[1]);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('AlertasAdmin');
    });
  });

  it('muestra un error si las credenciales son incorrectas', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Credenciales incorrectas' }),
    });

    renderLoginScreen();
    
    fireEvent.changeText(screen.getByPlaceholderText('ejemplo@gmail.com'), 'wrong@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Ejemplo123@'), 'wrongpass');
    fireEvent.press(screen.getAllByText('Iniciar sesión')[1]);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Credenciales incorrectas');
    });
  });
});
