import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { theme } from '../../theme';

export default function DateInput({
    label,
    icon = 'calendar',
    value,
    onChange,
    placeholder = 'Selecciona una fecha',
}) {
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
        marginVertical: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.inputLabel,
    },
    input: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder,
        backgroundColor: theme.colors.inputBackground,
        width: '100%',
    },
    textInput: {
        color: theme.colors.inputText,
    },
});
