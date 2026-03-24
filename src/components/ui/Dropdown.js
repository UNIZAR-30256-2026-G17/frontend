import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView, findNodeHandle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function Dropdown({ options = [], selected, onSelect, placeholder = 'Seleccionar...' }) {
    const [open, setOpen] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const buttonRef = useRef(null);

    const handleSelect = (option) => {
        onSelect(option);
        setOpen(false);
    };

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
                {/* Overlay */}
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
                                style={styles.option}
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
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.dropdownBackground,
        borderWidth: 1,
        borderColor: theme.colors.dropdownBorder,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    buttonText: {
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
        borderRadius: 12,
        maxHeight: 200,
    },
    option: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.dropdownOptionBorder,
    },
    optionText: {
        color: theme.colors.dropdownOptionText,
    },
});
