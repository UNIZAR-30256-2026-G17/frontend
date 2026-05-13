/**
 * @file AuthContext.js
 * @description Contexto para la gestión de la autenticación de la aplicación.
 * Permite almacenar y recuperar la sesión del usuario tanto en Web (localStorage) como en Móvil (AsyncStorage).
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creación del contexto de autenticación
export const AuthContext = createContext();

/**
 * Hook personalizado para acceder fácilmente al contexto de autenticación
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Helper unificado para almacenamiento persistente según la plataforma
 */
const storage = {
  get: async (key) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  set: async (key, value) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value);
    return AsyncStorage.setItem(key, value);
  },
  remove: async (key) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key);
    return AsyncStorage.removeItem(key);
  },
};

/**
 * Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar el componente, verificamos si hay una sesión guardada
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await storage.get('user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error recuperando sesión:', e);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  /**
   * Inicia sesión guardando los datos del usuario de forma persistente
   * @param {Object} userData - Datos del usuario y token
   */
  const login = async (userData) => {
    setUser(userData);
    await storage.set('user', JSON.stringify(userData));
    await storage.set('token', userData.token);
  };

  /**
   * Cierra la sesión eliminando los datos guardados
   */
  const logout = async () => {
    setUser(null);
    await storage.remove('user');
    await storage.remove('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
