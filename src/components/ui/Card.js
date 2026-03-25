import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function Card({
    title,
    description,
    children,
    icon,
    right,
}) {
    return (
        <View style={styles.card}>
            {(title || icon || right) && (
                <View style={styles.header}>

                    <View style={styles.leftHeader}>
                        {icon && (
                            <FontAwesome
                                name={icon}
                                size={20}
                                color={theme.colors.cardIcon}
                                style={styles.icon}
                            />
                        )}

                        {title && (
                            <Text style={styles.title}>
                                {title}
                            </Text>
                        )}
                    </View>

                    {right && (
                        <View style={styles.rightHeader}>
                            {right}
                        </View>
                    )}
                </View>
            )}

            {description && (
                <Text style={styles.description}>
                    {description}
                </Text>
            )}

            {children && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        borderRadius: 16,
        padding: 16,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightHeader: {
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    title: {
        ...theme.typography.cardTitle,
        color: theme.colors.cardText,
    },
    description: {
        ...theme.typography.cardDescription,
        color: theme.colors.cardText,
        marginBottom: 10,
    },
    content: {
        marginTop: 5,
        marginBottom: 10,
    },
});
