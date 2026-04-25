import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Container } from '../components/layout/Container';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Dropdown from '../components/ui/Dropdown';
import ToggleButton from '../components/ui/ToggleButton';
import Checkbox from '../components/ui/Checkbox';
import DateInput from '../components/ui/DateInput';
import Table from '../components/ui/Table';

import { theme } from '../theme';

export const HomeScreen = () => {
    // Para Dropdown
    const options = [
        { label: 'Madrid', value: 'madrid' },
        { label: 'Barcelona', value: 'barcelona' },
        { label: 'Valencia', value: 'valencia' },
    ];
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [noSelectedOption, setNoSelectedOption] = useState(null);

    // Para DateInput
    const [date, setDate] = useState(null);

    // Para Table
    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Edad', accessor: 'age' },
        { header: 'Ciudad', accessor: 'city' },
    ];

    const data = [
        { name: 'Juan', age: 25, city: 'Madrid' },
        { name: 'Ana', age: 30, city: 'Barcelona' },
    ];




    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    ¡Bienvenido a Montgomery SafetyMap App!
                </Text>

                <Text style={styles.text}>
                    Tu app para confiar en las calles de Montgomery
                </Text>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 24,
    },
    welcomeText: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
    },
    text: {
        ...theme.typography.body,
        color: theme.colors.text,
    },
});
