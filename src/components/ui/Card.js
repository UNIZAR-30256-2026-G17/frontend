/**
 * @file Card.js
 * @description Componente de tarjeta base con soporte para diseño "Glassmorphism",
 * iconos, títulos y acciones a la derecha.
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';

/**
 * Componente Card
 * @param {String} title - Título de la tarjeta
 * @param {String} description - Descripción corta debajo del título
 * @param {ReactNode} children - Contenido principal de la tarjeta
 * @param {String} icon - Nombre del icono de FontAwesome
 * @param {ReactNode} right - Componente a mostrar en la parte superior derecha
 */
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
                <View>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.lg,
        ...Platform.select({
            web: {
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: `0 8px 32px ${theme.colors.glassShadow}, 0 0 0 1px ${theme.colors.glassBorder}`,
            },
            ios: {
                shadowColor: theme.colors.glassShadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 1,
                shadowRadius: 24,
            },
            android: { elevation: 4 },
            default: {},
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
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
});
