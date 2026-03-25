import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { Container } from '../../components/layout/Container';

import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';

import { theme } from '../../theme';

export const StatsScreen = () => {
    const getColorByPercentage = (value) => {
        if (value >= 60) return theme.colors.danger;
        if (value >= 40) return theme.colors.warning;
        return theme.colors.success;
    };

    const percentageRobosHurtos = 60;
    const percentageViolenciaDelitosContraLaPersona = 40;
    const percentageOrdenPublicoVandalismo = 3;

    const options = [
        { label: 'Último día', value: 'last_day' },
        { label: 'Último mes', value: 'last_month' },
        { label: 'Último año', value: 'last_year' },
        { label: 'Últimos 3 años', value: 'last_3_years' },
    ];
    const [selectedOption, setSelectedOption] = useState(options[0]);

    return (
        <Container>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Estadísticas
                </Text>

                <Card
                    title="Porcentaje de clasificación de los tipos de delitos"
                    right={
                        <Dropdown
                            options={options}
                            selected={selectedOption}
                            onSelect={setSelectedOption}
                        />
                    }
                >

                    <View style={styles.sameRow}>
                        <Card
                            title="Robos y hurtos"
                        >
                            <Text style={[styles.percentage, { color: getColorByPercentage(percentageRobosHurtos) }]}>
                                {percentageRobosHurtos}%
                            </Text>
                            <Text style={styles.secondaryText}>
                                Robo con allanamiento, otros robos, robo de vehículos, robo desde vehículo, robo de partes o accesorios de vehículos, carterismo, robo de bolso, hurto en tiendas, robo en edificios, robo de máquinas o dispositivos operados con monedas
                            </Text>
                        </Card>

                        <Card
                            title="Violencia y delitos contra la persona"
                        >
                            <Text style={[styles.percentage, { color: getColorByPercentage(percentageViolenciaDelitosContraLaPersona) }]}>
                                {percentageViolenciaDelitosContraLaPersona}%
                            </Text>
                            <Text style={styles.secondaryText}>
                                Homicidio (todos), agresión agravada, agresión simple, robo con violencia o intimidación, secuestro / rapto, violación y abusos sexuales, trata de personas
                            </Text>
                        </Card>

                        <Card
                            title="Orden público y vandalismo"
                        >
                            <Text style={[styles.percentage, { color: getColorByPercentage(percentageOrdenPublicoVandalismo) }]}>
                                {percentageOrdenPublicoVandalismo}%
                            </Text>
                            <Text style={styles.secondaryText}>
                                Destrucción / daño / vandalismo de propiedad, conducta desordenada, violaciones de toque de queda / merodeo / vagancia, incendio provocado, allanamiento de propiedad privada
                            </Text>
                        </Card>
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
    sameRow: {
        flexDirection: 'row',
        gap: 10,
    },

    percentage: {
        ...theme.typography.statsPercentage,
        color: theme.colors.danger,
    },
    secondaryText: {
        ...theme.typography.body,
        color: theme.colors.cardTextSecondary,
    },
});
