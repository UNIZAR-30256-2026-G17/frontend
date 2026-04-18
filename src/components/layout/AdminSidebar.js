import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../../theme';

const NAV_ITEMS = [
  { label: 'Usuarios',      icon: 'user',        route: 'UsersAdmin' },
  { label: 'Delitos',       icon: 'warning',      route: 'DelitosAdmin'  },
  { label: 'Alertas',       icon: 'bell',         route: 'AlertasAdmin'  },
  { label: 'Rutas',         icon: 'map-marker',   route: 'AdminRutas'    },
  { label: 'Estadísticas',  icon: 'bar-chart',    route: 'AdminStats'    },
];

export function AdminSidebar() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.sidebar}>
      {/* Nav items */}
      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = route.name === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigation.navigate(item.route)}
            >
              <FontAwesome
                name={item.icon}
                size={16}
                color={isActive ? theme.colors.primary : 'rgba(255,255,255,0.5)'}
                style={styles.navIcon}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#1a1a1a',
    flexDirection: 'column',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  appName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  nav: {
    flex: 1,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderLeftColor: theme.colors.primary, // tu color amarillo/acento
  },
  navIcon: {
    width: 18,
    textAlign: 'center',
  },
  navLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '500',
  },
});