import React, { useState } from 'react';

interface ICellProps {
    value: string;
    onChange: (value: string) => void;
    type: 'text' | 'number' | 'date';
}

const Cell: React.FC<ICellProps> = ({ value, onChange, type }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleValidation = (value: string): boolean => {
        // Example: basic validation logic depending on the type
        if (type === 'number' && isNaN(Number(value))) {
            setError('Please enter a valid number');
            return false;
        }
        if (type === 'date' && isNaN(Date.parse(value))) {
            setError('Please enter a valid date');
            return false;
        }
        if (type === 'text' && value.length < 3) {
            setError('Please enter at least 3 characters');
            return false;
        }
        setError(null);
        return true;
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (handleValidation(e.target.value)) {
            onChange(e.target.value);
            //highlight the cell
            //save the data
            //save the data locally

        }
    };

    return (
        <td>
            {isEditing ? (
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            ) : (
                <div onDoubleClick={() => setIsEditing(true)}>
                    {value}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
            )}
        </td>
    );
};

export default Cell;
