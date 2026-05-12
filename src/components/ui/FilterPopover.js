import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme'; // Ruta a tu index.js del theme

export default function FilterPopover({ visible, onClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay oscurecido para dar foco a la tarjeta */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Contenedor central del Modal */}
      <View style={styles.modalContainer}>
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesome name="times" size={16} color={theme.colors.cardIcon || theme.colors.cardText} />
            </TouchableOpacity>
          </View>

          {/* Contenido con scroll por si hay muchos filtros */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // Usamos rgba para el overlay porque tu fondo general es negro sólido (#000000)
    // y aquí necesitamos transparencia
    backgroundColor: 'rgba(0,0,0,0.7)', 
  },
  modalContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '15%',
    width: '90%',
    maxWidth: 640,
  },
  card: {
    backgroundColor: theme.colors.glassBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
        boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${theme.colors.glassBorder}`,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.4,
        shadowRadius: 32,
      },
      android: { elevation: 10, backgroundColor: 'rgba(20, 20, 20, 0.95)' },
      default: {},
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  title: {
    ...theme.typography.cardTitle,
    color: theme.colors.cardText,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  scroll: {
    maxHeight: 500,
  },
  content: {
    padding: 20,
  },
});