/**
 * @file GenerateRoutesModal.js
 * @description Modal interactivo para solicitar la generación automática de rutas de patrullaje.
 * Permite al personal policial especificar el número de patrullas requeridas.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * Componente GenerateRoutesModal
 */
export default function GenerateRoutesModal({ visible, onClose, onConfirm }) {

    const [numPatrullas, setNumPatrullas] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Asegura que solo se introduzcan valores numéricos
     */
    const handleTextChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setNumPatrullas(numericValue);
    };

    /**
     * Inicia el proceso de generación de rutas
     */
    const handleGenerateRoutesPressed = async () => {
        if (!numPatrullas || parseInt(numPatrullas) <= 0) {
            setError('*Introduce un número válido mayor a 0');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Se ejecuta la lógica de generación pesada (con llamadas a OSRM)
            await onConfirm({ numPatrullas: parseInt(numPatrullas) });
            setNumPatrullas('1');
        } catch {
            // El error se maneja en el padre, pero aquí detenemos el loading
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cierra el modal limpiando estados, impidiendo cierre durante carga
     */
    const handleClose = () => {
        if (loading) return;
        setError('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Fondo oscurecido (Overlay) */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            />

            {/* Contenido del Modal */}
            <View style={styles.modalContainer}>
                <Card title="Generar rutas de patrullaje">
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>
                                Generando rutas inteligentes...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.text}>
                                Introduzca el número de rutas de patrullaje que desea generar. Las rutas generadas atravesarán los beats con mayor índice de criminalidad.
                            </Text>

                            <Input
                                label="Número de rutas"
                                placeholder="Introduce el número de rutas"
                                value={numPatrullas}
                                onChangeText={handleTextChange}
                                keyboardType="numeric"
                            />

                            {error && (
                                <Text style={styles.errorText}>
                                    {error}
                                </Text>
                            )}

                            <View style={styles.sameRow}>
                                <Button
                                    title="Cancelar"
                                    icon="close"
                                    variant="danger"
                                    onPress={handleClose}
                                />

                                <Button
                                    title="Generar rutas"
                                    icon="check"
                                    variant="success"
                                    onPress={handleGenerateRoutesPressed}
                                />
                            </View>
                        </>
                    )}
                </Card>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        position: 'absolute',
        alignSelf: 'center',
        top: '20%',
        width: '90%',
        maxWidth: 800,
    },
    loadingContainer: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        ...theme.typography.body,
        color: theme.colors.cardText,
        marginTop: theme.spacing.md,
        textAlign: 'center'
    },
    sameRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        justifyContent: 'flex-end',
    },
    text: {
        ...theme.typography.body,
        color: theme.colors.cardText,
        marginBottom: theme.spacing.md,
    },
    errorText: {
        ...theme.typography.body,
        color: theme.colors.danger,
        marginBottom: theme.spacing.sm,
        fontSize: 14,
    },
});
