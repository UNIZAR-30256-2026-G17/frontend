import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


export default function GenerateRoutesModal({ visible, onClose, onConfirm }) {

    const [numPatrullas, setNumPatrullas] = useState(1);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTextChange = (text) => {
        // Filtra para que solo permita dígitos (0-9)
        const numericValue = text.replace(/[^0-9]/g, '');
        setNumPatrullas(numericValue);
    };

    const handleGenerateRoutesPressed = async () => {
        if (!numPatrullas || parseInt(numPatrullas) <= 0) {
            setError('*Introduce un número válido mayor a 0');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Esperamos a que la función de confirmación (que es async en el padre) termine
            await onConfirm({ numPatrullas: parseInt(numPatrullas) });
            setNumPatrullas('1');
        } catch (e) {
            // El error se maneja en el padre, pero aquí detenemos el loading
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return; // Evitar cerrar mientras genera
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
            {/* Overlay */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            />

            {/* Modal content */}
            <View style={styles.modalContainer}>
                <Card title="Generar rutas de patrullaje">
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.text, { marginTop: 15, textAlign: 'center' }]}>
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
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sameRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'flex-end',
    },
    text: {
        ...theme.typography.body,
        color: theme.colors.cardText,
        marginBottom: 15,
    },
    errorText: {
        color: theme.colors.danger,
        marginBottom: 10,
        fontSize: 14,
    },
});
