import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
  Platform, Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from '../ui/Button';

export const ProfileSidebar = ({ visible, onClose, user, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

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
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!user) return null;

  const getUserInitial = () =>
    user?.email ? user.email.charAt(0).toUpperCase() : '?';

  const getUserName = () => {
    if (!user?.email) return '—';
    const local = user.email.split('@')[0];
    return local.charAt(0).toUpperCase() + local.slice(1);
  };

  const roleLabel = {
    admin: 'Administrador',
    police: 'Policía',
    citizen: 'Ciudadano',
  }[user?.role] ?? user?.role ?? '—';

  const roleIcon = {
    admin: 'shield',
    police: 'star',
    citizen: 'user',
  }[user?.role] ?? 'user';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>

        {/* Top row */}
        <View style={styles.topRow}>
          <Text style={styles.panelTitle}>Mi perfil</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={18} color="rgba(0,0,0,0.45)" />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Avatar + nombre + rol */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getUserInitial()}</Text>
            </View>
            <View style={styles.roleIconBadge}>
              <FontAwesome name={roleIcon} size={10} color={theme.colors.headerBackground} />
            </View>
          </View>
          <Text style={styles.userName}>{getUserName()}</Text>
          <View style={styles.rolePill}>
            <FontAwesome name={roleIcon} size={11} color="rgba(0,0,0,0.6)" />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Info rows */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <FontAwesome name="envelope" size={13} color="rgba(0,0,0,0.5)" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <FontAwesome name="id-badge" size={13} color="rgba(0,0,0,0.5)" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rol en el sistema</Text>
              <Text style={styles.infoValue}>{roleLabel}</Text>
            </View>
          </View>

          {user.id && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <FontAwesome name="hashtag" size={13} color="rgba(0,0,0,0.5)" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID de usuario</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Botón cerrar sesión */}
        <View style={styles.footer}>
          <Button
            title="Cerrar sesión"
            icon="sign-out"
            variant="danger"
            onPress={onLogout}
          />
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
    top: 0, right: 0, bottom: 0,
    width: 290,
    backgroundColor: theme.colors.headerBackground,
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 25,
    flexDirection: 'column',
    paddingBottom: 36,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.headerText,
    letterSpacing: 0.2,
  },
  closeButton: {
    padding: 8,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginHorizontal: 20,
    marginVertical: 6,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
  },
  avatarOuter: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  avatarText: {
    color: theme.colors.headerText,
    fontSize: 32,
    fontWeight: 'bold',
  },
  roleIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.headerBackground,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.headerText,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // Info rows
  infoSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.headerText,
    fontWeight: '600',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});