import React, { useEffect, useRef, useState} from 'react';
import {ColumnType} from "./types";

interface ICellProps {
    value: ColumnType;
    onValueChange:  (rowId: string, columnId: string, newValue: any) => void;
    columnId: string;
    rowId: string;
    type?: ColumnType;
    children?: React.ReactNode;
}

const Cell: React.FC<ICellProps> = ({ value, onValueChange, columnId,rowId, type,children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);

    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        console.log("initializing value")
        setNewValue(value);
    }, [value]);


    const handleValidation = (value: ColumnType): boolean => {
        // Example: basic validation logic depending on the type
        if (typeof value === 'number' && isNaN(Number(value))) {
            setError('Please enter a valid number');
            return false;
        }
        if (typeof value === 'boolean' && typeof value !== 'boolean') {
            setError('Please enter a valid boolean value');
            return false;
        }

        setError(null);
        return true;
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (handleValidation(newValue)) {
            onValueChange(rowId,columnId,newValue);
        }else{
            setError("Please enter a valid value")
        }
    };

    return (
        <td onDoubleClick={() => setIsEditing(true)}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={newValue.toString()}
                    onChange={(e) => setNewValue(e.target.value)}
                    onBlur={handleBlur}
                />
            ) : (
                 <span>{value.toString()}</span>
                //todo selectionList?
            )}
            {children}
        </td>
    );
};

export default Cell;
