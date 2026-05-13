import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../theme';
import Card from './Card';

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
        marginHorizontal: -8,
        marginBottom: 24,
    },
    containerMobile: {
        marginHorizontal: -4,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    column: {
        flex: 1,
        paddingHorizontal: 8,
        minWidth: 160,
    },
    columnMobile: {
        width: '50%',
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    card: {
        padding: 16,
        // Sobrescribimos padding interno del Card si es necesario
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    value: {
        fontFamily: 'PlusJakarta-Bold',
        fontSize: 22,
        includeFontPadding: false,
    },
    label: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: theme.colors.textSecondary || '#888',
        marginTop: 2,
    },
});

export default SummaryCards;