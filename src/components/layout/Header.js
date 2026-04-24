import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const Header = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isLogged = !!user;
  const isAdmin = user?.role === 'admin';
  const isPolice = user?.role === 'police';

  // Tabs según rol
  const tabs = isAdmin
    ? []
    : isPolice
    ? [
        { label: 'Alertas', route: 'AlertasPolice' },
        { label: 'Delitos', route: 'DelitosPolice' },
        { label: 'Estadísticas', route: 'EstadisticasPolice' },
        { label: 'Mapa', route: 'Map' },
      ]
    : [
        { label: 'Mapa', route: 'Map' },
        { label: 'Estadísticas', route: 'Stats' },
      ];

  const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name
  );

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigation.navigate('Home');
  };

  const getUserInitial = () =>
    user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.header}>

      {/* LEFT */}
      <View style={styles.leftSection}>
        {isMobile && (
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.menuButton}>
            <FontAwesome name="bars" size={22} color={theme.colors.headerText} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => !isAdmin && navigation.navigate('Home')}>
          <Text style={styles.title}>Montgomery SafetyMap</Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT */}
      <View style={styles.rightSection}>
        {!isMobile && (
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.route}
                style={[styles.tab, currentRoute === tab.route && styles.activeTab]}
                onPress={() => navigation.navigate(tab.route)}
              >
                <Text style={styles.tabText}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* AVATAR o BOTÓN según si está logueado */}
        {isLogged ? (
          <View style={styles.avatarWrapper}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <Text style={styles.avatarLetter}>{getUserInitial()}</Text>
              <FontAwesome
                name={profileMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={10}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            <Modal
              visible={profileMenuOpen}
              transparent
              animationType="none"
              onRequestClose={() => setProfileMenuOpen(false)}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setProfileMenuOpen(false)}>
                <Pressable style={styles.dropdown} onPress={(e) => e.stopPropagation()}>
                  <View style={styles.dropdownInfo}>
                    <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                  <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                    <FontAwesome name="sign-out" size={16} color={theme.colors.danger} />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        ) : (
          <Button
            title="Iniciar sesión"
            variant="header"
            onPress={() => navigation.navigate('LoginAdmin')}
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
        <TouchableOpacity
          style={styles.mobileOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        />
        <View style={styles.modalMenu}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.route}
              style={[styles.mobileTab, currentRoute === tab.route && styles.activeMobileTab]}
              onPress={() => { setMenuOpen(false); navigation.navigate(tab.route); }}
            >
              <Text style={styles.tabText}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
          {isLogged && (
            <TouchableOpacity style={styles.mobileLogout} onPress={handleLogout}>
              <FontAwesome name="sign-out" size={16} color={theme.colors.danger} />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

    </View>
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
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.headerText,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  tabs: { flexDirection: 'row', marginRight: 20 },
  tab: { paddingHorizontal: 15, paddingVertical: 8 },
  tabText: { fontSize: 16, color: theme.colors.headerTabText, fontWeight: '600' },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.headerTabActiveBorder,
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderRadius: 6,
  },
  menuButton: { padding: 8, marginRight: 5 },

  // Avatar
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.headerTabActiveBorder,
  },
  avatarLetter: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  // Dropdown
  modalOverlay: { flex: 1 },
  dropdown: {
    position: 'absolute',
    top: 65,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 200,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownInfo: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 5,
  },
  userEmail: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  userRole: { fontSize: 11, color: '#666', textTransform: 'uppercase' },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  logoutText: { color: theme.colors.danger, fontWeight: '600' },

  // Mobile menu
  mobileOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
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
  mobileTab: { paddingVertical: 10, paddingHorizontal: 15 },
  activeMobileTab: {
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.headerTabActiveBorder,
  },
  mobileLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 5,
  },
});