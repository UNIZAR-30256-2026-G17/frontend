import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Helper que usa localStorage en web y AsyncStorage en móvil
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await storage.get('user');
        console.log('Usuario guardado en storage:', savedUser);
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error recuperando sesión:', e);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await storage.set('user', JSON.stringify(userData));
    await storage.set('token', userData.token);
  };

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