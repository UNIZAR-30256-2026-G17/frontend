import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function Checkbox({
    label,
    defaultValue = false,
    onChange,
    disabled = false,
}) {
    const [checked, setChecked] = useState(defaultValue);

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
        gap: 10,
        marginVertical: 10,
    },
    box: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        ...theme.typography.body,
    },
});
