import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Platform,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { NavSidebar } from './NavSideBar';
import { ProfileSidebar } from './ProfileSideBar';
import Button from '../ui/Button';

const LOGO = require('../../../assets/montgomery-icon.png');

export const Header = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, logout } = useAuth();

  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLogged = !!user;
  const isAdmin = user?.role === 'admin';
  const isPolice = user?.role === 'police';

  const tabs = isAdmin
    ? [
        { label: 'Usuarios',     route: 'Panel de Usuarios',   icon: 'user' },
        { label: 'Delitos',      route: 'Panel de Delitos',  icon: 'warning' },
        { label: 'Alertas',      route: 'Panel de Alertas',  icon: 'bell' },
      ]
    : isPolice
      ? [
          { label: 'Mapa',          route: 'Mapa Policial',    icon: 'map-marker' },
          { label: 'Delitos',       route: 'Listado de Delitos', icon: 'exclamation-triangle' },
          { label: 'Alertas',       route: 'Gestión de Alertas', icon: 'bell' },
          { label: 'Estadísticas',  route: 'Estadísticas Policiales',  icon: 'bar-chart' },
        ]
      : [
          { label: 'Mapa',         route: 'Mapa',   icon: 'map-marker' },
          { label: 'Estadísticas', route: 'Estadísticas', icon: 'bar-chart' },
        ];

  const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name
  );

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigation.navigate('Inicio');
  };

  const handleNavigate = (route) => {
    setNavOpen(false);
    navigation.navigate(route);
  };

  const getUserInitial = () =>
    user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <>
      <View style={styles.header}>

        {/* ── LEFT: hamburger (mobile) + logo + nombre (desktop) ── */}
        <View style={isMobile ? styles.sideSection : styles.leftSection}>
          {isMobile && (
            <TouchableOpacity onPress={() => setNavOpen(true)} style={styles.iconButton}>
              <FontAwesome name="bars" size={20} color={theme.colors.headerText} />
            </TouchableOpacity>
          )}
          {!isMobile && (
            <TouchableOpacity
              style={styles.logoArea}
              onPress={() => !isAdmin && navigation.navigate('Inicio')}
            >
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Montgomery SafetyMap</Text>
            </TouchableOpacity>
          )}
        </View>

        {isMobile && (
          <TouchableOpacity
            style={styles.logoAreaMobile}
            onPress={() => !isAdmin && navigation.navigate('Inicio')}
          >
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
        )}

        {/* ── RIGHT: tabs (desktop) + avatar/login ── */}
        <View style={styles.rightSection}>

          {/* Tabs solo en desktop */}
          {!isMobile && (
            <View style={styles.tabs}>
              {tabs.map((tab) => {
                const isActive = currentRoute === tab.route;
                return (
                  <TouchableOpacity
                    key={tab.route}
                    style={[styles.tab, isActive && styles.activeTab]}
                    onPress={() => navigation.navigate(tab.route)}
                  >
                    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Avatar o botón login */}
          {isLogged ? (
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setProfileOpen(true)}
            >
              <Text style={styles.avatarText}>{getUserInitial()}</Text>
            </TouchableOpacity>
          ) : isMobile ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Iniciar Sesión')}
            >
              <FontAwesome name="user-circle" size={30} color={theme.colors.headerText} />
            </TouchableOpacity>
          ) : (
            <Button
              title="Iniciar sesión"
              variant="header"
              onPress={() => navigation.navigate('Iniciar Sesión')}
            />
          )}
        </View>
      </View>

      {/* ── SIDEBARS ── */}
      <NavSidebar
        visible={isMobile && navOpen}
        onClose={() => setNavOpen(false)}
        tabs={tabs}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        logo={LOGO}
      />

      <ProfileSidebar
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.headerBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerMobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  logoAreaMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.headerText,
    letterSpacing: 0.2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.headerTabActiveBorder,
    backgroundColor: theme.colors.headerTabActiveBackground,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.headerTabText,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.headerTabActiveBorder,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.headerButtonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.headerButtonText,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  avatarText: {
    color: theme.colors.headerButtonText,
    fontSize: 17,
    fontWeight: 'bold',
  },
});