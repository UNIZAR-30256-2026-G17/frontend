import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Container } from '../../components/layout/Container';
import { theme } from '../../theme';
import { FontAwesome } from '@expo/vector-icons';
import Card from '../../components/ui/Card';

export const AlertsScreen = () => {
    const alerts = [
        { id: '1', type: 'Accidente', location: '11948 Andrew St, Silver Spring', status: 'Active', time: 'hace 5 min', priority: 'High' },
        { id: '2', type: 'Robo', location: 'Wheaton Plaza, Silver Spring', status: 'Pending', time: 'hace 15 min', priority: 'Medium' },
        { id: '3', type: 'Vandalismo', location: 'Sligo Creek Pkwy', status: 'Closed', time: 'hace 1h', priority: 'Low' },
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return theme.colors.danger;
            case 'Medium': return theme.colors.warning;
            case 'Low': return theme.colors.success;
            default: return theme.colors.text;
        }
    };

    return (
        <Container>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Centro de Alertas</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Activas</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>5</Text>
                        <Text style={styles.statLabel}>Urgentes</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>48</Text>
                        <Text style={styles.statLabel}>Hoy</Text>
                    </View>
                </View>

                <View style={styles.alertsContainer}>
                    {alerts.map((alert) => (
                        <Card key={alert.id}>
                            <View style={styles.alertHeader}>
                                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(alert.priority) }]}>
                                    <Text style={styles.priorityText}>{alert.priority}</Text>
                                </View>
                                <Text style={styles.timeText}>{alert.time}</Text>
                            </View>

                            <View style={styles.alertBody}>
                                <Text style={styles.alertType}>{alert.type}</Text>
                                <View style={styles.locationRow}>
                                    <FontAwesome name="map-marker" size={14} color={theme.colors.cardTextSecondary} />
                                    <Text style={styles.locationText}>{alert.location}</Text>
                                </View>
                            </View>

                            <View style={styles.alertFooter}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Text style={styles.actionButtonText}>Gestionar</Text>
                                    <FontAwesome name="chevron-right" size={12} color={theme.colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
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
        padding: 20,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        ...theme.typography.pageTitle,
        color: theme.colors.text,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        backgroundColor: theme.colors.cardBackground,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.cardBorder,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.cardTextSecondary,
        marginTop: 4,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        color: theme.colors.tagText,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    timeText: {
        fontSize: 12,
        color: theme.colors.cardTextSecondary,
    },
    alertsContainer: {
        gap: 16,
    },
    alertBody: {
        marginBottom: 15,
    },
    alertType: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.cardText,
        marginBottom: 5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationText: {
        fontSize: 14,
        color: theme.colors.cardTextSecondary,
    },
    alertFooter: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        ...Platform.select({
            web: { cursor: 'pointer' },
            default: {},
        }),
    },
    actionButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
