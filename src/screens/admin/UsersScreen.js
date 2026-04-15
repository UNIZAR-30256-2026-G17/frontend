import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Container } from '../../components/layout/Container';

import { theme } from '../../theme';

export const UsersScreen = () => {

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>
                    Usuarios
                </Text>

                <View style={styles.content}>
                    <Text>hola</Text>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginTop: 16,
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        margin: 16,
    },
});
