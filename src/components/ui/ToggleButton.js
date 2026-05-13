/**
 * @file ToggleButton.js
 * @description Componente de botón con estado de conmutación (on/off).
 * Utiliza el componente Button base con diferentes variantes según el estado.
 */

import React from 'react';
import Button from './Button';

/**
 * Componente ToggleButton
 * @param {String} title - Texto del botón
 * @param {String} icon - Icono a mostrar cuando no está seleccionado
 * @param {Boolean} selected - Estado de selección
 * @param {Function} onToggle - Función al cambiar el estado
 * @param {Boolean} disabled - Si el botón está deshabilitado
 */
export default function ToggleButton({
    title,
    icon,
    selected = false,
    onToggle,
    disabled = false,
}) {
    /**
     * Maneja la pulsación y notifica el cambio de estado
     */
    const handlePress = () => {
        if (disabled) return;
        if (onToggle) {
            onToggle(!selected);
        }
    };

    return (
        <Button
            title={title}
            icon={selected ? 'check' : icon}
            variant={selected ? 'primary' : 'secondary'}
            onPress={handlePress}
            disabled={disabled}
        />
    );
}
