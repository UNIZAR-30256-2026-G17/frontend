import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../components/layout/Container';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

import { theme } from '../theme';

export const HomeScreen = () => {
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
