/**
 * @file Dropdown.js
 * @description Componente de selector desplegable personalizado con diseño "Glassmorphism".
 * Soporta posicionamiento dinámico y diseño responsivo.
 */

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

/**
 * Componente Dropdown
 * @param {Array} options - Lista de objetos { label, value }
 * @param {Object} selected - Opción seleccionada actualmente
 * @param {Function} onSelect - Función que recibe la opción seleccionada
 * @param {String} placeholder - Texto a mostrar si no hay selección
 */
export default function Dropdown({ options = [], selected, onSelect, placeholder = 'Seleccionar...' }) {
    const [open, setOpen] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const buttonRef = useRef(null);

    /**
     * Maneja la selección de una opción
     * @param {Object} option - Opción pulsada
     */
    const handleSelect = (option) => {
        onSelect(option);
        setOpen(false);
    };

    /**
     * Mide la posición del botón para desplegar el modal justo debajo
     */
    const openDropdown = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setButtonLayout({ x: px, y: py, width, height });
                setOpen(true);
            });
        }
    };

    return (
        <View style={styles.wrapper}>
            {/* Botón */}
            <TouchableOpacity
                ref={buttonRef}
                style={styles.button}
                onPress={openDropdown}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    {selected?.label || placeholder}
                </Text>
                <FontAwesome
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.colors.cardText}
                />
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                {/* Overlay para cerrar al pulsar fuera */}
                <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                    <View />
                </Pressable>

                {/* Dropdown posicionado */}
                <View style={[
                    styles.modalDropdown,
                    {
                        top: buttonLayout.y + buttonLayout.height,
                        left: buttonLayout.x,
                        width: buttonLayout.width,
                    }
                ]}>
                    <ScrollView>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    index === options.length - 1 && styles.lastOption
                                ]}
                                onPress={() => handleSelect(option)}
                            >
                                <Text style={styles.optionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        // Contenedor principal
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.dropdownBackground,
        borderWidth: 1,
        borderColor: theme.colors.dropdownBorder,
        borderRadius: theme.radii.md,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 12,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            },
            default: {},
        }),
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.dropdownText,
        fontSize: 14,
        marginRight: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalDropdown: {
        position: 'absolute',
        backgroundColor: theme.colors.dropdownOptionBackground,
        borderWidth: 1,
        borderColor: theme.colors.dropdownOptionBorder,
        borderRadius: theme.radii.md,
        maxHeight: 200,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${theme.colors.glassBorder}`,
            },
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.35,
                shadowRadius: 20,
            },
            android: { elevation: 8 },
            default: {},
        }),
    },
    option: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.dropdownOptionBorder,
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    optionText: {
        ...theme.typography.body,
        color: theme.colors.dropdownOptionText,
    },
});
