import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Pressable, Platform, Animated, Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export const NavSidebar = ({ visible, onClose, tabs, currentRoute, onNavigate, logo }) => {
  const slideAnim = useRef(new Animated.Value(-260)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -260,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>

        {/* Header */}
        <View style={styles.sidebarHeader}>
          {logo && <Image source={logo} style={styles.logo} resizeMode="contain" />}
          <Text style={styles.appName}>Montgomery{'\n'}SafetyMap</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={18} color="rgba(0,0,0,0.45)" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Nav items */}
        <View style={styles.nav}>
          {tabs.map((tab) => {
            const isActive = currentRoute === tab.route;
            return (
              <TouchableOpacity
                key={tab.route}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => onNavigate(tab.route)}
              >
                <FontAwesome
                  name={tab.icon}
                  size={16}
                  color={isActive ? theme.colors.headerText : 'rgba(0,0,0,0.38)'}
                  style={styles.navIcon}
                />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.footerText}>Montgomery County{'\n'}Safety Department</Text>
        </View>

      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebar: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: 240,
    backgroundColor: theme.colors.headerBackground,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 25,
    flexDirection: 'column',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  appName: {
    flex: 1,
    color: theme.colors.headerText,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  closeButton: {
    padding: 6,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  nav: {
    flex: 1,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  navItemActive: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderLeftColor: theme.colors.headerText,
  },
  navIcon: {
    width: 18,
    textAlign: 'center',
  },
  navLabel: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    fontWeight: '500',
  },
  navLabelActive: {
    color: theme.colors.headerText,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 32,
  },
  footerText: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 11,
    color: 'rgba(0,0,0,0.3)',
    lineHeight: 16,
    fontWeight: '500',
  },
});