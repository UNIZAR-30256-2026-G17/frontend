/**
 * @file DateInput.js
 * @description Componente de entrada de fecha con soporte multiplataforma (Android y Web).
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { theme } from '../../theme';

/**
 * Componente DateInput
 * @param {String} label - Etiqueta superior
 * @param {String} icon - Nombre del icono de FontAwesome
 * @param {Date} value - Valor actual de la fecha
 * @param {Function} onChange - Función que recibe la nueva fecha seleccionada
 * @param {String} placeholder - Texto a mostrar cuando no hay fecha seleccionada
 */
export default function DateInput({
    label,
    icon = 'calendar',
    value,
    onChange,
    placeholder = 'Selecciona una fecha',
}) {
    const [isFocused, setIsFocused] = useState(false);

    /**
     * Abre el selector de fecha nativo de Android
     */
    const openAndroidPicker = () => {
        DateTimePickerAndroid.open({
            value: value || new Date(),
            mode: 'date',
            onChange: (event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                    onChange?.(selectedDate);
                }
            },
        });
    };

    /**
     * Formatea la fecha para mostrarla al usuario
     * @param {Date} date - Fecha a formatear
     */
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES');
    };

    return (
        <View style={styles.wrapper}>
            {(label || icon) && (
                <View style={styles.labelContainer}>
                    {icon && (
                        <FontAwesome
                            name={icon}
                            size={16}
                            color={theme.colors.inputIcon}
                            style={styles.icon}
                        />
                    )}
                    {label && (
                        <Text style={styles.label}>{label}</Text>
                    )}
                </View>
            )}

            {/* ANDROID */}
            {Platform.OS === 'android' && (
                <TouchableOpacity
                    style={styles.input}
                    onPress={openAndroidPicker}
                >
                    <Text style={styles.textInput}>
                        {value ? formatDate(value) : placeholder}
                    </Text>
                </TouchableOpacity>
            )}

            {/* WEB */}
            {Platform.OS === 'web' && (
                <View>
                    <input
                        type="date"
                        value={value ? value.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            if (e.target.value) {
                                onChange?.(new Date(e.target.value));
                            }
                        }}
                        style={{ ...styles.input, ...styles.textInput }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: theme.spacing.sm,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.inputLabel,
    },
    input: {
        padding: 10,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        backgroundColor: theme.colors.inputBackground,
        width: '100%',
    },
    textInput: {
        color: theme.colors.inputText,
    },
});
