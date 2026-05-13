/**
 * @file SummaryCards.js
 * @description Conjunto de tarjetas de resumen con contadores animados y diseño responsivo.
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Card from './Card';

/**
 * Componente para mostrar un valor numérico con una animación de conteo.
 */
const AnimatedValue = ({ value, suffix = '', color }) => {
    const anim = useRef(new Animated.Value(0)).current;
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        const listenerId = anim.addListener(({ value: v }) => {
            setDisplay(Math.floor(v));
        });

        return () => anim.removeListener(listenerId);
    }, [value, anim]);

    return (
        <Text style={[styles.value, { color: color || theme.colors.text }]}>
            {display}{suffix}
        </Text>
    );
};


/**
 * Tarjeta individual de resumen.
 */
const SummaryCard = ({ icon, label, value, suffix, color, delay = 0 }) => {
    return (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: `${color}15` },
                    theme.shadows.glow(color, 0.2)
                ]}>
                    <FontAwesome name={icon} size={20} color={color} />
                </View>
                <View style={styles.textContainer}>
                    <AnimatedValue value={value} suffix={suffix} color={color} />
                    <Text style={styles.label}>{label}</Text>
                </View>
            </View>
        </Card>
    );
};

/**
 * Contenedor de múltiples tarjetas de resumen con diseño adaptable.
 * @param {Array} data - Lista de objetos con { icon, label, value, color, suffix }
 */
export const SummaryCards = ({ data = [] }) => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={[styles.container, isMobile && styles.containerMobile]}>
            {data.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.column,
                        isMobile && styles.columnMobile
                    ]}
                >
                    <SummaryCard {...item} delay={index * 100} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme.spacing.sm,
        marginBottom: theme.spacing.xl,
    },
    containerMobile: {
        marginHorizontal: -4,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    column: {
        flex: 1,
        paddingHorizontal: theme.spacing.sm,
        minWidth: 160,
    },
    columnMobile: {
        width: '50%',
        paddingHorizontal: 4,
        marginBottom: theme.spacing.sm,
    },
    card: {
        padding: theme.spacing.lg,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: theme.radii.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    value: {
        fontFamily: theme.typography.bodyBold.fontFamily,
        fontSize: 22,
        includeFontPadding: false,
    },
    label: {
        fontFamily: theme.typography.body.fontFamily,
        fontSize: 12,
        color: theme.colors.textSecondary || '#888',
        marginTop: 2,
    },
});

export default SummaryCards;