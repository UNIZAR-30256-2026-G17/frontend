import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


export default function CreateAlertModal({ visible, onClose, onConfirm }) {

    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');

    const handleCreateAlertPressed = () => {
        if (!description.trim() || !address.trim()) {
            setError('*Todos los campos son obligatorios');
            return;
        }

        setError('');
        onConfirm({ description, address });
        setDescription('');
        setAddress('');
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
                <Card title="Crear alerta">
                    <Text style={styles.text}>
                        Crea una alerta para informar sobre un posible delito
                    </Text>

                    <Input
                        label="Descripción del delito"
                        placeholder="Introduce la descripción"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Input
                        label="Dirección"
                        placeholder="Introduce la dirección"
                        value={address}
                        onChangeText={setAddress}
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
                            title="Crear alerta"
                            icon="check"
                            variant="success"
                            onPress={handleCreateAlertPressed}
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
