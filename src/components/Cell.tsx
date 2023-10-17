import React, {useEffect, useRef, useState} from 'react';

interface ICellProps {
    value: string;
    onValueChange:  (rowIndex: number, columnId: string, newValue: any) => void;
    columnId: string;
    rowIndex: number;
    type?: 'text' | 'number' | 'date';
}

const Cell: React.FC<ICellProps> = ({ value, onValueChange, columnId,rowIndex, type }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);

    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);
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
        if (handleValidation(newValue)) {
            onValueChange(rowIndex,columnId,newValue);
        }else{
            setError("Please enter a valid value")
        }
    };

    return (
        <td onDoubleClick={() => setIsEditing(true)}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onBlur={handleBlur}
                />
            ) : (
                value
            )}
        </td>
    );
};

export default Cell;
