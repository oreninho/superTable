import React, {ReactNode} from "react";

export type ColumnType = string | number | boolean | Date | null | undefined |Selection


export type RowData = {
    id: string
    [columnId: string]: any
    children?: RowData[]
}

export type GroupData = {
    [groupBy:string]: RowData[];
};


export type  ColumnData =  Array<{
    id: string
    ordinalNo: number
    title: string
    type: string
    width?: number
}>

export type RowsData = Array<RowData>
export interface CompleteTableData{
    columns: ColumnData
    initialData: RowsData
}

export interface BaseTableDataProps {
    columns: ColumnData
    initialData: RowsData
    onDataChange?: (data: RowsData ) => void

}

export interface TableWrapperProps  extends BaseTableDataProps {
    children?:  ReactNode;

    //todo? what should be here?
}
