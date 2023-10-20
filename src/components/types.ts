import React, {ReactNode} from "react";

export type ColumnType = string | number | boolean  |Selection


export type RowData = {
    id: string
    [columnId: string]: any
    children?: RowData[]
}

export type GroupData = {
    [groupBy:string]: RowData[];
};


export type ColumnData = {
    id: string
    ordinalNo: number
    title: string
    type: string
    width?: number
}

export type  ColumnsData =  Array<{
    id: string
    ordinalNo: number
    title: string
    type: string
    width?: number
}>

export type RowsData = Array<RowData>
export interface CompleteTableData{
    columns: ColumnsData
    initialData: RowsData
}

export interface BaseTableDataProps {
    columns: ColumnsData
    initialData: RowsData
    onDataChange?: (data: RowsData ) => void

}

export interface TableWrapperProps  extends BaseTableDataProps {
    children:  (columns:ColumnsData, initialData:RowsData, onDataChange?:(data: RowsData ) => void )=> ReactNode
}
