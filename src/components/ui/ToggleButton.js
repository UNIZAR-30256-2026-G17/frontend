import React from 'react';
import Button from './Button';

export default function ToggleButton({
    title,
    icon,
    selected = false,
    onToggle,
    disabled = false,
}) {
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
