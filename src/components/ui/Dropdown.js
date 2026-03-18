import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function Dropdown({
    options = [],
    selected,
    onSelect,
    placeholder = 'Seleccionar...',
}) {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setOpen(false);
    };

    return (
        <View style={styles.wrapper}>
            {/* Botón */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => setOpen(!open)}
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

            {/* Opciones */}
            {open && (
                <View style={styles.dropdown}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => handleSelect(option)}
                        >
                            <Text style={styles.optionText}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        borderRadius: 12,

        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    buttonText: {
        color: theme.colors.cardText,
        fontSize: 14,
        marginRight: 10,
    },
    dropdown: {
        marginTop: 5,
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        borderRadius: 12,
        overflow: 'hidden',
    },
    option: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
    },
    optionText: {
        color: theme.colors.cardText,
    },
});
