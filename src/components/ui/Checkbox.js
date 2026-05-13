/**
 * @file Checkbox.js
 * @description Componente de checkbox personalizado con estilos integrados en el tema.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

/**
 * Componente Checkbox
 * @param {String} label - Etiqueta del checkbox
 * @param {Boolean} defaultValue - Valor inicial
 * @param {Function} onChange - Función que recibe el nuevo valor al cambiar
 * @param {Boolean} disabled - Si el componente está deshabilitado
 */
export default function Checkbox({
    label,
    defaultValue = false,
    onChange,
    disabled = false,
}) {
    const [checked, setChecked] = useState(defaultValue);

    /**
     * Maneja el cambio de estado del checkbox
     */
    const handlePress = () => {
        if (disabled) return;

        const newValue = !checked;
        setChecked(newValue);

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, disabled && { opacity: 0.5 }]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.box,
                    {
                        backgroundColor: checked
                            ? theme.colors.checkboxCheckedBackground
                            : theme.colors.checkboxUncheckedBackground,
                        borderColor: theme.colors.checkboxBorder,
                    },
                ]}
            >
                {checked && (
                    <FontAwesome
                        name="check"
                        size={14}
                        color={theme.colors.checkboxCheckIcon}
                    />
                )}
            </View>

            <Text style={[styles.label, { color: theme.colors.checkboxText }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginVertical: theme.spacing.sm,
    },
    box: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderRadius: theme.radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        ...theme.typography.body,
    },
});
