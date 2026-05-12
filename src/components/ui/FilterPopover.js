import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
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
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
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