/**
 * @file ProtectedScreen.js
 * @description Higher-Order Component (HOC) para proteger pantallas.
 * Verifica si el usuario está autenticado y si tiene los permisos (roles) necesarios para acceder.
 */

import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

/**
 * HOC withProtection
 * @param {ReactComponent} Component - Componente de la pantalla a proteger
 * @param {Array} allowedRoles - Lista de roles permitidos para acceder (ej: ['admin', 'police'])
 */
export const withProtection = (Component, allowedRoles) => {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();
    const navigation = useNavigation();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      // No hacemos nada mientras el estado de carga inicial está activo
      if (loading) return;

      // Si no hay usuario, redirigir al login
      if (!user) {
        setRedirecting(true);
        setTimeout(() => navigation.replace('Iniciar Sesión'), 0);
        return;
      }

      // Si el rol del usuario no está en la lista de permitidos, redirigir al inicio
      if (allowedRoles && !allowedRoles.includes(user?.role)) {
        setRedirecting(true);
        setTimeout(() => navigation.replace('Inicio'), 0);
      }
    }, [user, loading]);

    // Muestra spinner mientras carga O mientras se procesa la redirección
    if (loading || redirecting) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          backgroundColor: theme.colors.background 
        }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    // Si el usuario es válido, renderizar el componente solicitado
    return <Component {...props} />;
  };
};