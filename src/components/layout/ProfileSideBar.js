/**
 * @file ProfileSidebar.js
 * @description Barra lateral deslizante que muestra la información del perfil del usuario 
 * y permite cerrar la sesión. Incluye animaciones y diseño premium.
 */

import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
  Platform, Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import Button from '../ui/Button';

/**
 * Componente ProfileSidebar
 * @param {Boolean} visible - Controla la visibilidad de la barra lateral
 * @param {Function} onClose - Función al cerrar la barra lateral
 * @param {Object} user - Objeto con los datos del usuario autenticado
 * @param {Function} onLogout - Función para cerrar sesión
 */
export const ProfileSidebar = ({ visible, onClose, user, onLogout }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Manejo de animaciones de entrada/salida y pulso del avatar
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }).start();
      pulseAnim.setValue(0);
    }
  }, [visible]);

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  if (!user) return null;

  /**
   * Obtiene la inicial del correo para el avatar
   */
  const getUserInitial = () =>
    user?.email ? user.email.charAt(0).toUpperCase() : '?';

  /**
   * Formatea el nombre de usuario a partir del correo
   */
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
        <LinearGradient
          colors={['#1A1A1A', '#1A1A1A', '#2D2600']}
          style={StyleSheet.absoluteFill}
        />

        {/* Top row */}
        <View style={styles.topRow}>
          <Text style={styles.panelTitle}>Mi perfil</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Avatar + nombre + rol */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarOuter}>
            <Animated.View 
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: ringScale }],
                  opacity: ringOpacity,
                }
              ]} 
            />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getUserInitial()}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{getUserName()}</Text>
          <View style={styles.rolePill}>
            <FontAwesome name={roleIcon} size={11} color={theme.colors.primary} />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Info rows */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <FontAwesome name="envelope" size={13} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo electrónico</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <FontAwesome name="id-badge" size={13} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Rol en el sistema</Text>
              <Text style={styles.infoValue}>{roleLabel}</Text>
            </View>
          </View>

          {user.id && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrapper}>
                <FontAwesome name="hashtag" size={13} color="#FFFFFF" />
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
    width: 320,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10 },
      android: { elevation: 25 },
      web: { backdropFilter: 'blur(20px)', boxShadow: '-4px 0px 30px rgba(0,0,0,0.5)' },
    }),
    flexDirection: 'column',
    paddingBottom: theme.spacing.xxxl,
    zIndex: 2000,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 52,
    paddingBottom: theme.spacing.lg,
  },
  panelTitle: {
    fontFamily: theme.typography.pageTitle.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  closeButton: {
    padding: theme.spacing.sm,
    ...Platform.select({ web: { cursor: 'pointer' }, default: {} }),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.md,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    gap: 10,
  },
  avatarOuter: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    zIndex: 2,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    zIndex: 1,
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: theme.typography.title.fontFamily,
    fontWeight: '700',
    fontSize: 32,
  },
  userName: {
    fontFamily: theme.typography.title.fontFamily,
    fontWeight: '700',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 8,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  roleText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: theme.typography.bodyBold.fontFamily,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Info rows
  infoSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
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
    borderRadius: theme.radii.sm,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    fontFamily: theme.typography.bodyBold.fontFamily,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: theme.typography.bodyMedium.fontFamily,
    fontWeight: '600',
  },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 16,
  },
});