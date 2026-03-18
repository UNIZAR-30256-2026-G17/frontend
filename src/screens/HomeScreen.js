import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/layout/Container';
import { theme } from '../theme/theme';

export const HomeScreen = () => {
    return (
        <Container>
            <Text style={styles.welcomeText}>
                ¡Bienvenido a Montgomery SafetyMap App!
            </Text>
            <Text style={styles.subText}>
                Selecciona una pestaña en la cabecera para comenzar o inicia sesión.
            </Text>
        </Container>
    );
};

const styles = StyleSheet.create({
    welcomeText: {
        fontSize: 24,
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
    },
});
