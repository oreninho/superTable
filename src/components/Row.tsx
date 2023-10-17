// import React, { useState } from 'react';
// import Cell from "./Cell";
//
// interface RowData {
//     [key: string]: any; // Adjust this to fit your data's structure
// }
//
// interface RowProps {
//     data: RowData;
//     rowIndex: number;
//     isChild?: boolean;
//     handleEdit:  (rowIndex: number, columnId: string, newValue: any) => void;
// }
//
// const Row: React.FC<RowProps> = ({ data, isChild = false,rowIndex, handleEdit }) => {
//     const [collapsed, setCollapsed] = useState(true);
//
//     const hasChildren = data.children && data.children.length > 0;
//
//     const toggleCollapse = () => {
//         if (hasChildren) {
//             setCollapsed(!collapsed);
//         }
//     };
//
//
//     return (
//         <>
//             <tr onDoubleClick={toggleCollapse} style={{ backgroundColor: isChild ? '#e0e0e0' : '' }}>
//                 {Object.values(data).map((cell, index) => {
//                     if (typeof cell !== 'object') {
//                         return <Cell key={index} value={cell} onChange={handleEdit} rowIndex={rowIndex} columnId={cell.id} />
//                     }
//                     return null;
//                 })}
//             </tr>
//             {!collapsed && hasChildren && data.children.map((childRow: RowData, index: number) => (
//                 <Row key={index} data={childRow} isChild={true} handleEdit={handleEdit} rowIndex={rowIndex} />
//             ))}
//         </>
//     );
// };
//
// export default Row;
import React from 'react';
import Cell from './Cell'; // assuming you have these files

interface RowProps {
    row: { [key: string]: any };
    rowIndex: number;
    columns: Array<{ id: string; [key: string]: any }>;
    onValueChange: (rowIndex: number, columnId: string, newValue: any) => void;
}

const Row: React.FC<RowProps> = ({ row, rowIndex, columns, onValueChange }) => {
    const [collapsed, setCollapsed] = React.useState(true);

    const hasChildren = row.children && row.children.length > 0;
    return (
        <>
        <tr>
            {columns.map(column => (
                <Cell
                    key={column.id}
                    value={row[column.id]}
                    columnId={column.id}
                    rowIndex={rowIndex}
                    onValueChange={onValueChange}
                />
            ))}
        </tr>
        {!collapsed && hasChildren && row.children.map((childRow: any, index: number) => (
            <Row key={index} row={childRow} rowIndex={index} columns={columns} onValueChange={onValueChange} />
        ))}
        </>
    );
};

export default Row;
