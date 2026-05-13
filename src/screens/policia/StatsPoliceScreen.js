/**
 * @file StatsPoliceScreen.js
 * @description Pantalla de resumen estadístico avanzado para el personal policial.
 * Muestra indicadores clave de rendimiento (KPIs) y gráficos de tendencias.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container } from '../../components/layout/Container';
import { theme } from '../../theme';
import Card from '../../components/ui/Card';
import Dropdown from '../../components/ui/Dropdown';

/**
 * Componente StatsPoliceScreen
 */
export const StatsPoliceScreen = () => {
    // Opciones para el filtro de periodo de tiempo
    const options = [
        { label: 'Últimos 7 días', value: '7d' },
        { label: 'Último mes', value: '1m' },
        { label: 'Último trimestre', value: '3m' },
        { label: 'Este año', value: 'ytd' },
    ];
    
    const [selectedOption, setSelectedOption] = useState(options[1]);

    // Datos estáticos de ejemplo para los KPIs
    const stats = [
        { label: 'Crímenes Totales', value: '1,284', change: '+5.2%', trend: 'up' },
        { label: 'Tiempo de Respuesta', value: '8.4 min', change: '-1.2 min', trend: 'down' },
        { label: 'Alertas Atendidas', value: '942', change: '+12.4%', trend: 'up' },
    ];

    return (
        <Container>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                
                {/* Cabecera con título y selector de fecha */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Estadísticas Policiales</Text>
                    <View style={styles.dropdownContainer}>
                        <Dropdown
                            options={options}
                            selected={selectedOption}
                            onSelect={setSelectedOption}
                        />
                    </View>
                </View>

                {/* Grid de tarjetas KPI */}
                <View style={styles.summaryGrid}>
                    {stats.map((stat, index) => (
                        <Card key={index} style={styles.summaryCard}>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={[
                                styles.statChange,
                                { color: stat.trend === 'up' ? theme.colors.danger : theme.colors.success }
                            ]}>
                                {stat.change} vs periodo anterior
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Gráfico de barras de ejemplo */}
                <Card title="Distribución de Crímenes por Distrito" style={styles.mainCard}>
                    <View style={styles.chartPlaceholder}>
                        <View style={[styles.bar, { height: '80%', backgroundColor: theme.colors.primary }]} />
                        <View style={[styles.bar, { height: '60%', backgroundColor: theme.colors.primary }]} />
                        <View style={[styles.bar, { height: '90%', backgroundColor: theme.colors.primary }]} />
                        <View style={[styles.bar, { height: '40%', backgroundColor: theme.colors.primary }]} />
                        <View style={[styles.bar, { height: '70%', backgroundColor: theme.colors.primary }]} />
                        <View style={[styles.bar, { height: '55%', backgroundColor: theme.colors.primary }]} />
                    </View>
                    <View style={styles.chartLabels}>
                        <Text style={styles.chartLabel}>D1</Text>
                        <Text style={styles.chartLabel}>D2</Text>
                        <Text style={styles.chartLabel}>D3</Text>
                        <Text style={styles.chartLabel}>D4</Text>
                        <Text style={styles.chartLabel}>D5</Text>
                        <Text style={styles.chartLabel}>D6</Text>
                    </View>
                </Card>

                {/* Secciones inferiores de eficiencia e información táctica */}
                <View style={styles.bottomGrid}>
                    <Card title="Eficiencia de Patrulla" style={styles.smallCard}>
                        <View style={styles.efficiencyCircle}>
                            <Text style={styles.efficiencyValue}>92%</Text>
                        </View>
                    </Card>
                    <Card title="Zonas de Calor" style={styles.smallCard}>
                        <Text style={styles.infoText}>D3 y D5 muestran un incremento del 15% en actividad nocturna.</Text>
                    </Card>
                </View>

            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginBottom: 0,
    },
    dropdownContainer: {
        width: 200,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
    },
    summaryCard: {
        flex: 1,
        minWidth: 250,
    },
    statLabel: {
        fontSize: 14,
        color: theme.colors.cardTextSecondary,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.body.fontFamily,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.typography.title.fontFamily,
    },
    statChange: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: theme.typography.bodyBold.fontFamily,
    },
    mainCard: {
        marginBottom: theme.spacing.xl,
    },
    chartPlaceholder: {
        height: 200,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingTop: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder,
    },
    bar: {
        width: 40,
        borderTopLeftRadius: theme.radii.xs,
        borderTopRightRadius: theme.radii.xs,
        opacity: 0.8,
    },
    chartLabels: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: theme.spacing.sm,
    },
    chartLabel: {
        fontSize: 12,
        color: theme.colors.cardTextSecondary,
        fontFamily: theme.typography.body.fontFamily,
    },
    bottomGrid: {
        flexDirection: 'row',
        gap: theme.spacing.lg,
        flexWrap: 'wrap',
    },
    smallCard: {
        flex: 1,
        minWidth: 300,
    },
    efficiencyCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 8,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: theme.spacing.sm,
    },
    efficiencyValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        fontFamily: theme.typography.title.fontFamily,
    },
    infoText: {
        ...theme.typography.body,
        color: theme.colors.cardTextSecondary,
    },
});
