import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

import Button from '../ui/Button';

export const Header = () => {
  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const tabs = [
    { label: 'Mapa', route: 'Map' },
    { label: 'Estadísticas', route: 'Stats' },
  ];

  const currentRoute = useNavigationState(
    (state) => state.routes[state.index].name
  );

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

        <Button
          title="Iniciar sesión"
          variant="header"
          onPress={() => navigation.navigate('LoginPolice')}
        />
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
  },
  menuButton: {
    padding: 8,
    marginRight: 5,
  },
  mobileTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeMobileTab: {
    backgroundColor: theme.colors.headerTabActiveBackground,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.headerTabActiveBorder,
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
});
