
import React, {useMemo} from 'react';
import Cell from './Cell';
import { RowData} from "./types";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";

export interface RowProps {
    row: RowData ;
    rowIndex: number;
    columns: Array<{ id: string; [key: string]: any }>;
    onValueChange: (rowIndex: number, columnId: string, newValue: any) => void;
    children?: RowData[];
}

const Row: React.FC<RowProps> = ({ row, rowIndex, columns, onValueChange }) => {
    const [collapsed, setCollapsed] = React.useState(true);

    const toggleCollapse = () => {
        if (row.children && row.children?.length > 0) {
            setCollapsed(!collapsed);
        }
    };

    const Switcher = <span onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
                {  (collapsed ? <FaAngleUp /> : <FaAngleDown />)}
            </span>



    const memoizedCell = useMemo(() => {
        return columns.map((column, index) => (
            <Cell
                key={column.id}
                value={row[column.id]}
                columnId={column.id}
                rowIndex={rowIndex}
                onValueChange={onValueChange}
                type={column.type}
                children={index === 0 && row.children && row.children.length >1 ? Switcher : undefined}
            />
        ))
    },[row,columns,rowIndex,onValueChange,Switcher])
    return (
        <>
        <tr >
            {columns.map((column, index) => (
                memoizedCell[index]
            ))}
        </tr>
        {!collapsed  && row.children?.map((childRow: any, index: number) => (
            <Row key={index} row={childRow} rowIndex={index} columns={columns} onValueChange={onValueChange} />
        ))}
        </>
    );
};

export default Row;
