import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export const withProtection = (Component, allowedRoles) => {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();
    const navigation = useNavigation();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (loading) return;

      if (!user) {
        setRedirecting(true);
        setTimeout(() => navigation.replace('Login'), 0);
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user?.role)) {
        setRedirecting(true);
        setTimeout(() => navigation.replace('Home'), 0);
      }
    }, [user, loading, navigation]);

    // Muestra spinner mientras carga O mientras redirige
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

    return <Component {...props} />;
  };
};