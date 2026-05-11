import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../src/screens/LoginScreen';
import { AuthProvider } from '../../src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../../src/theme';

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
    
    // El texto "Iniciar sesión" aparece en el título y en el botón
    expect(screen.getAllByText('Iniciar sesión').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('ejemplo@gmail.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ejemplo123@')).toBeTruthy();
    
    // Verificar botones
    expect(screen.getByText('Registrarse')).toBeTruthy();
  });

  it('muestra un mensaje de error si los campos están vacíos', async () => {
    renderLoginScreen();
    
    const loginButton = screen.getAllByText('Iniciar sesión')[1];
    fireEvent.press(loginButton);

    await waitFor(() => {
      // Ahora usamos AppSnackbar, así que buscamos el texto en pantalla
      expect(screen.getByText('Todos los campos son obligatorios')).toBeTruthy();
    });
  });

  it('inicia sesión con éxito como policía y navega a Mapa Policial', async () => {
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
      expect(mockedNavigate).toHaveBeenCalledWith('Mapa Policial');
    });
  });

  it('inicia sesión con éxito como admin y navega a Panel de Alertas', async () => {
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
      expect(mockedNavigate).toHaveBeenCalledWith('Panel de Alertas');
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
      expect(screen.getByText('Credenciales incorrectas')).toBeTruthy();
    });
  });
});
