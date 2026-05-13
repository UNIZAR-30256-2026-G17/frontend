import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Platform, Animated, useWindowDimensions
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useScroll } from '../../context/ScrollContext';
import { NavSidebar } from './NavSideBar';
import { ProfileSidebar } from './ProfileSideBar';
import Button from '../ui/Button';

const LOGO = require('../../../assets/montgomery-icon.png');

export const Header = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const isScrolled = scrollY > 50;

  const bgColor = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(bgColor, {
      toValue: isScrolled ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isScrolled, bgColor]);

  const animatedBackground = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFCC00', 'rgba(255, 204, 0, 0.85)'],
  });

  const animatedBlur = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const [navOpen, setNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLogged = !!user;
  const isAdmin = user?.role === 'admin';
  const isPolice = user?.role === 'police';

  const sections = React.useMemo(() => isAdmin
    ? [
      {
        title: 'GESTIÓN',
        items: [
          { label: 'Usuarios', route: 'Panel de Usuarios', icon: 'user' },
          { label: 'Alertas', route: 'Panel de Alertas', icon: 'bell' },
        ]
      },
      {
        title: 'DATOS',
        items: [
          { label: 'Delitos', route: 'Panel de Delitos', icon: 'warning' },
        ]
      },
    ]
    : isPolice
      ? [
        {
          title: 'MAPA',
          items: [{ label: 'Explorar', route: 'Mapa Policial', icon: 'map-marker' }]
        },
        {
          title: 'GESTIÓN',
          items: [
            { label: 'Alertas', route: 'Gestión de Alertas', icon: 'bell' },
            // { label: 'Rutas', route: 'Rutas de Patrullaje', icon: 'road' },
          ]
        },
        {
          title: 'DATOS',
          items: [
            { label: 'Delitos', route: 'Listado de Delitos', icon: 'exclamation-triangle' },
            { label: 'Estadísticas', route: 'Estadísticas Policiales', icon: 'bar-chart' },
          ]
        },
      ]
      : [
        {
          title: 'EXPLORAR',
          items: [
            { label: 'Mapa', route: 'Mapa', icon: 'map-marker' },
            { label: 'Estadísticas', route: 'Estadísticas', icon: 'bar-chart' },
          ]
        }
      ], [isAdmin, isPolice]);

  const allTabs = React.useMemo(() => sections.flatMap(s => s.items), [sections]);

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

  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: animatedBackground },
          Platform.OS === 'web' && {
            backdropFilter: isScrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
            transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
          }
        ]}
      >
        {Platform.OS !== 'web' && (
          <AnimatedBlurView
            intensity={animatedBlur}
            style={StyleSheet.absoluteFill}
            tint="light"
          />
        )}

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
              onPress={() => isPolice && navigation.navigate('Mapa Policial') || !isAdmin && !isPolice && navigation.navigate('Inicio')}
            >
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Montgomery SafetyMap</Text>
            </TouchableOpacity>
          )}
        </View>

        {isMobile && (
          <View style={styles.logoAreaMobile} pointerEvents="box-none">
            <TouchableOpacity
              onPress={() => !isAdmin && navigation.navigate('Inicio')}
            >
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}

        {/* ── RIGHT: tabs (desktop) + avatar/login ── */}
        <View style={styles.rightSection}>

          {/* Tabs solo en desktop */}
          {!isMobile && (
            <View style={styles.tabs}>
              {allTabs.map((tab) => {
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
      </Animated.View>

      {/* ── SIDEBARS ── */}
      <NavSidebar
        visible={navOpen}
        onClose={() => setNavOpen(false)}
        sections={sections}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
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
    ...theme.shadows.glow(theme.colors.headerTabActiveBorder, 0.6),
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
    ...theme.shadows.glow(theme.colors.primary, 0.2),
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  avatarText: {
    color: theme.colors.headerButtonText,
    fontSize: 17,
    fontWeight: 'bold',
  },
});