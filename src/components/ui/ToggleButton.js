import React, { useState } from 'react';
import Button from './Button';

export default function ToggleButton({
    title,
    icon,
    defaultSelected = false,
    onToggle,
    disabled = false,
}) {
    const [selected, setSelected] = useState(defaultSelected);

    const handlePress = () => {
        if (disabled) return;

        const newValue = !selected;
        setSelected(newValue);

        if (onToggle) {
            onToggle(newValue);
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
