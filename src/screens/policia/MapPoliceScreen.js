import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';

import { Container } from '../../components/layout/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import Map from '../../components/map/Map';

import { API_URL } from '../../config/api';

export const MapPoliceScreen = () => {

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.title}>Panel Policial - Montgomery</Text>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginTop: 16,
        alignSelf: 'center',
    },
});
