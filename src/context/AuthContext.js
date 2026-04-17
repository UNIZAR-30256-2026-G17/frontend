import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar usuario al iniciar la app
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (error) {
            console.error('Error cargando datos de autenticación:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData, token) => {
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setToken(token);
        } catch (error) {
            console.error('Error guardando datos de login:', error);
        }
    };

    const logout = async () => {
        const currentToken = token;
        
        // Limpiar estado local inmediatamente para respuesta instantánea del UI
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Error eliminando datos de sesión local:', error);
        }

        // Notificar al servidor en segundo plano (sin await para no bloquear la UI)
        if (currentToken) {
            fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: ''
            }).catch (error => {
                console.error('Error al cerrar sesión en el servidor:', error);
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
