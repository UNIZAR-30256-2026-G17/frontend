import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

import Button from '../ui/Button';

import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = React.useMemo(() => {
    if (user?.role === 'police') {
      return [
        { label: 'Mapa', route: 'MapPolice' },
        { label: 'Alertas', route: 'Alerts' },
        { label: 'Delitos', route: 'Crimes' },
        { label: 'Estadísticas', route: 'StatsPolice' },
      ];
    }
    // Ciudadano o sin login
    return [
      { label: 'Mapa', route: 'Map' },
      { label: 'Estadísticas', route: 'Stats' },
    ];
  }, [user]);

  const currentRoute = useNavigationState(
    (state) => state ? state.routes[state.index]?.name : null
  );

  const handleLogout = async () => {
    console.log("DENTRO");
    setShowUserMenu(false);
    try {
      await logout();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error during logout navigation:', error);
    }
  };

  return (
    <View style={styles.header}>

      {/* LEFT SIDE */}
      <View style={styles.leftSection}>

        {isMobile && (
          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            style={styles.menuButton}
          >
            <FontAwesome
              name="bars"
              size={22}
              color={theme.colors.headerText}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.title}>
            Montgomery SafetyMap
          </Text>
        </TouchableOpacity>

      </View>

      {/* RIGHT SIDE */}
      <View style={styles.rightSection}>

        {!isMobile && (
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.route}
                style={[
                  styles.tab,
                  currentRoute === tab.route && styles.activeTab
                ]}
                onPress={() => navigation.navigate(tab.route)}
              >
                <Text style={styles.tabText}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {user ? (
          <View style={styles.userContainer}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setShowUserMenu(!showUserMenu)}
            >
              <Text style={styles.avatarText}>P</Text>
            </TouchableOpacity>

            {showUserMenu && (
              <View style={styles.userDropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleLogout}
                >
                  <FontAwesome name="sign-out" size={16} color={theme.colors.text} />
                  <Text style={styles.dropdownItemText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Button
            title="Iniciar sesión"
            variant="header"
            onPress={() => navigation.navigate('LoginPolice')}
          />
        )}
      </View>

      {/* MOBILE MENU */}
      <Modal
        visible={isMobile && menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        {/* overlay */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />

        {/* menu */}
        <View style={styles.modalMenu}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.route}
              style={[
                styles.mobileTab,
                currentRoute === tab.route && styles.activeMobileTab
              ]}
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate(tab.route);
              }}
            >
              <Text style={styles.tabText}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.headerBackground,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.headerText,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginRight: 20,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.headerTabText,
    fontWeight: '600',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.headerTabActiveBorder,
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderRadius: 6,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  menuButton: {
    padding: 8,
    marginRight: 5,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  mobileTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  activeMobileTab: {
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.headerTabActiveBorder,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalMenu: {
    position: 'absolute',
    top: 89,
    left: 20,
    backgroundColor: theme.colors.headerBackground,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 160,
    zIndex: 9999,
    elevation: 30,
  },
  userContainer: {
    position: 'relative',
    marginLeft: 10,
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
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  avatarText: {
    color: theme.colors.headerButtonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingVertical: 8,
    minWidth: 150,
    zIndex: 10000,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  dropdownItemText: {
    color: theme.colors.cardText,
    fontSize: 14,
    fontWeight: '600',
  },
});
