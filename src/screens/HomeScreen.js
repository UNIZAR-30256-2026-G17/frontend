import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Container } from '../components/layout/Container';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Dropdown from '../components/ui/Dropdown';
import ToggleButton from '../components/ui/ToggleButton';
import Checkbox from '../components/ui/Checkbox';

import { theme } from '../theme';

export const HomeScreen = () => {
    const options = [
        { label: 'Madrid', value: 'madrid' },
        { label: 'Barcelona', value: 'barcelona' },
        { label: 'Valencia', value: 'valencia' },
    ];

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [noSelectedOption, setNoSelectedOption] = useState(null);


    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    ¡Bienvenido a Montgomery SafetyMap App!
                </Text>

                {/* BOTONES */}
                <Text style={styles.text}>
                    Botones disponibles:
                </Text>
                <View style={styles.sameRow}>
                    <Button
                        title="Botón primario"
                        icon="user"
                        variant="primary"
                        onPress={() => console.log('Botón primario presionado')}
                    />
                    <Button
                        title="Botón secundario"
                        icon="user"
                        variant="secondary"
                        onPress={() => console.log('Botón secundario presionado')}
                    />
                    <Button
                        title="Botón de cabecera"
                        icon="user"
                        variant="header"
                        onPress={() => console.log('Botón de cabecera presionado')}
                    />
                    <Button
                        title="Botón eliminar"
                        icon="close"
                        variant="danger"
                        onPress={() => console.log('Botón eliminar presionado')}
                    />
                    <Button
                        title="Botón de éxito"
                        icon="check"
                        variant="success"
                        onPress={() => console.log('Botón de éxito presionado')}
                    />
                </View>

                {/* CARDS */}
                <Text style={styles.text}>
                    Cards disponibles:
                </Text>
                <View style={styles.sameRow}>
                    <Card
                        title="Zona segura"
                        description="No se han reportado incidentes recientes"
                    />
                    <Card
                        title="Zona peligrosa"
                        description="Alta incidencia de robos"
                        icon="warning"
                    />
                    <Card
                        title="Estadísticas"
                        description="Estadísticas de esta semana"
                        icon="bar-chart"
                    >
                        <Text style={{ color: 'white' }}>
                            12 incidentes esta semana
                        </Text>
                        <View style={styles.sameRow}>
                            <Button
                                title="Cancelar"
                                icon="close"
                                variant="danger"
                                onPress={() => console.log('Cancelar')}
                            />
                            <Button
                                title="Confirmar"
                                icon="check"
                                variant="success"
                                onPress={() => console.log('Confirmar')}
                            />
                        </View>
                    </Card>
                </View>

                {/* INPUTS DISPONIBLES */}
                <Text style={styles.text}>
                    Inputs disponibles:
                </Text>
                <View style={styles.sameRow}>
                    <Input
                        label="Email"
                        placeholder="Introduce tu email"
                    />
                    <Input
                        label="Contraseña"
                        icon="lock"
                        placeholder="********"
                        secureTextEntry
                    />
                </View>

                {/* DROPDOWNS DISPONIBLES */}
                <Text style={styles.text}>
                    Dropdowns disponibles:
                </Text>
                <View style={styles.sameRow}>
                    <Dropdown
                        options={options}
                        selected={selectedOption}
                        onSelect={setSelectedOption}
                    />
                    <Dropdown
                        options={options}
                        selected={noSelectedOption}
                        onSelect={setNoSelectedOption}
                    />
                </View>

                {/* TOGGLE BUTTON */}
                <Text style={styles.text}>
                    ToggleButton disponible:
                </Text>
                <View style={styles.sameRow}>
                    <ToggleButton
                        title="Seleccionar opción"
                        onToggle={(value) => console.log(value)}
                    />
                </View>

                {/* CHECK BOX */}
                <Text style={styles.text}>
                    Checkbox disponible:
                </Text>
                <Checkbox
                    label="Aceptar términos y condiciones"
                    onChange={(value) => console.log(value)}
                />

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
