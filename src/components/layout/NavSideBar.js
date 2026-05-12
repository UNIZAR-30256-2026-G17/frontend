import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Pressable, Platform, Animated, Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export const NavSidebar = ({ visible, onClose, sections = [], currentRoute, onNavigate, logo }) => {
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -280,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const toggleSection = (title) => {
    setCollapsed(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            {logo && <Image source={logo} style={styles.sidebarLogo} />}
            <View>
              <Text style={styles.sidebarTitle}>Montgomery</Text>
              <Text style={styles.sidebarSubtitle}>SafetyMap v2.0</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesome name="times" size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* Navigation */}
          <View style={styles.navScroll}>
            {sections.map((section, sIdx) => (
              <View key={section.title} style={styles.section}>
                <TouchableOpacity 
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.title)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <FontAwesome 
                    name={collapsed[section.title] ? "chevron-down" : "chevron-up"} 
                    size={10} 
                    color="rgba(255,255,255,0.3)" 
                  />
                </TouchableOpacity>

                {!collapsed[section.title] && (
                  <View style={styles.sectionContent}>
                    {section.items.map((item, iIdx) => {
                      const isActive = currentRoute === item.route;
                      return (
                        <TouchableOpacity
                          key={item.route}
                          style={[styles.navItem, isActive && styles.navItemActive]}
                          onPress={() => onNavigate(item.route)}
                        >
                          <View style={styles.navItemInner}>
                            <FontAwesome
                              name={item.icon}
                              size={16}
                              color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                              style={styles.navIcon}
                            />
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                              {item.label}
                            </Text>
                          </View>
                          {isActive && <View style={styles.activeDot} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Montgomery County Safety Dept</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#1A1A1A',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '10px 0px 30px rgba(0,0,0,0.5)',
      }
    })
  },
  sidebarHeader: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sidebarSubtitle: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 35,
    right: 20,
    padding: 8,
  },
  navScroll: {
    flex: 1,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sectionContent: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 209, 0, 0.08)',
  },
  navItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navIcon: {
    width: 20,
    textAlign: 'center',
  },
  navLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '600',
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.glow(theme.colors.primary, 0.5),
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  footerText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});