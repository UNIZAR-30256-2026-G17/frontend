import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Container } from '../../components/layout/Container';

import { theme } from '../../theme';

export const MapScreen = () => {
    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Mapa de Montgomery
                </Text>


            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeText: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
    },
    text: {
        ...theme.typography.body,
        color: theme.colors.text,
    },
    sameRow: {
        flexDirection: 'row',
        gap: 10,
    },
});
