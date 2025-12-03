import React from 'react';
import { Input } from 'antd';

/**
 * MoneyInput component
 * Displays a value formatted as currency (e.g., 0.00) with a fixed "S/" prefix.
 * Implements "ATM-style" input where typing digits shifts the number from right to left.
 * 
 * @param {number} value - The numeric value (float)
 * @param {function} onChange - Callback with the new numeric value
 * @param {object} props - Other props passed to Antd Input
 */
const MoneyInput = ({ value = 0, onChange, ...props }) => {
    // Ensure value is a number
    const safeValue = typeof value === 'number' ? value : 0;

    const formatValue = (val) => {
        return val.toFixed(2);
    };

    const handleKeyDown = (e) => {
        const { key } = e;

        // Allow navigation and control keys
        if (
            ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(key) ||
            e.ctrlKey || e.metaKey || e.altKey
        ) {
            return;
        }

        e.preventDefault();

        const currentCents = Math.round(safeValue * 100);
        let newCents = currentCents;

        if (/\d/.test(key)) {
            const digit = parseInt(key, 10);
            // Prevent overflow if needed (e.g. max safe integer), but unlikely for this use case
            newCents = currentCents * 10 + digit;
        } else if (key === 'Backspace') {
            newCents = Math.floor(currentCents / 10);
        } else if (key === 'Delete') {
            newCents = 0;
        } else {
            return; // Ignore other keys
        }

        onChange?.(newCents / 100);
    };

    return (
        <Input
            {...props}
            value={formatValue(safeValue)}
            addonBefore={<span className="text-gray-500">S/</span>}
            onKeyDown={handleKeyDown}
            onChange={() => { }} // Controlled by onKeyDown
            style={{ ...props.style, textAlign: 'right' }}
            autoComplete="off"
        />
    );
};

export default MoneyInput;
