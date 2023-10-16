import React, { useState } from 'react';

interface RowData {
    [key: string]: any; // Adjust this to fit your data's structure
}

interface RowProps {
    data: RowData;
    isChild?: boolean;
}

const Row: React.FC<RowProps> = ({ data, isChild = false }) => {
    const [collapsed, setCollapsed] = useState(true);

    const hasChildren = data.children && data.children.length > 0;

    const toggleCollapse = () => {
        if (hasChildren) {
            setCollapsed(!collapsed);
        }
    };

    return (
        <>
            <tr onDoubleClick={toggleCollapse} style={{ backgroundColor: isChild ? '#e0e0e0' : '' }}>
                {Object.values(data).map((cell, index) => {
                    if (typeof cell !== 'object') {
                        return <td key={index}>{cell}</td>;
                    }
                    return null;
                })}
            </tr>
            {!collapsed && hasChildren && data.children.map((childRow: RowData, index: number) => (
                <Row key={index} data={childRow} isChild={true} />
            ))}
        </>
    );
};

export default Row;
