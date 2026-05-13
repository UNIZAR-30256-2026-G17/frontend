/**
 * @file GenerateRouteModal.js
 * @description Modal para solicitar la generación de una ruta segura.
 * Permite introducir el origen y el destino de la ruta.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


export default function GenerateRouteModal({ visible, onClose, onConfirm }) {

    const [initialAddress, setInitialAddress] = useState('');
    const [finalAddress, setFinalAddress] = useState('');

    const [error, setError] = useState('');

    const handleGenerateRoutePressed = () => {
        if (!initialAddress.trim() || !finalAddress.trim()) {
            setError('*Todos los campos son obligatorios');
            return;
        }

        setError('');
        onConfirm({ initialAddress, finalAddress });
        setInitialAddress('');
        setFinalAddress('');
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
                <Card title="Generar ruta">
                    <Text style={styles.text}>
                        Se buscará la ruta más segura entre las direcciones proporcionadas, siendo esta la que atraviese los distritos con menor índice de criminalidad
                    </Text>

                    <Input
                        label="Dirección de partida"
                        placeholder="Introduce la dirección"
                        value={initialAddress}
                        onChangeText={setInitialAddress}
                    />

                    <Input
                        label="Dirección de destino"
                        placeholder="Introduce la dirección"
                        value={finalAddress}
                        onChangeText={setFinalAddress}
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
                            onPress={onClose}
                        />

                        <Button
                            title="Generar ruta"
                            icon="check"
                            variant="success"
                            onPress={handleGenerateRoutePressed}
                        />
                    </View>


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
