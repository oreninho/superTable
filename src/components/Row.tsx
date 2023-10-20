
import React, {useMemo} from 'react';
import Cell from './Cell';
import {ColumnData, ColumnsData, RowData} from "./types";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";

export interface RowProps {

    row: RowData ;
    parentRowIndex: number;
    columns: ColumnsData;
    onValueChange: (rowId: string, columnId: string, newValue: any) => void;
    children?: RowData[];
    className?: string;
}

const Row: React.FC<RowProps> = ({ row, parentRowIndex, columns, onValueChange }) => {
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
        return (column:ColumnData, index:number) => (
            <Cell
                key={column.id}
                value={row[column.id]}
                columnId={column.id}
                rowId={row.id}
                onValueChange={onValueChange}
                type={column.type}
                children={index === 0 && row.children && row.children.length >1 ? Switcher : undefined}
            />
        )
    },[onValueChange,row,Switcher])
    return (
        <>
        <tr >
            {columns.map((column, index) => (
                memoizedCell(column,index)
            ))}
        </tr>
        {!collapsed  && row.children?.map((childRow: RowData, index: number) => (
            <Row className={"child-row"} key={parentRowIndex+index} row={childRow} parentRowIndex={parentRowIndex+index}  columns={columns} onValueChange={onValueChange} />
        ))}
        </>
    );
};

export default Row;
