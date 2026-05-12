import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function Input({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
}) {
    const [isFocused, setIsFocused] = useState(false);

    const stylesDynamic = {
        container: {
            borderColor: isFocused
                ? theme.colors.inputBorderFocused
                : theme.colors.inputBorder,
            backgroundColor: theme.colors.inputBackground,
        },
        input: {
            flex: 1,
            color: theme.colors.inputText,
            ...theme.typography.body,
            paddingVertical: 12,
            paddingRight: 10,
        },
        label: {
            color: theme.colors.inputLabel,
            ...theme.typography.bodyBold,
        },
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
                        <Text style={[styles.label, stylesDynamic.label]}>
                            {label}
                        </Text>
                    )}
                </View>
            )}

            <View style={[styles.container, stylesDynamic.container]}>
                <TextInput
                    style={[styles.input, stylesDynamic.textInput]}
                    placeholder={placeholder}
                    placeholderTextColor="#888"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
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
    },
    container: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    input: {
        fontSize: 14,
    },
});