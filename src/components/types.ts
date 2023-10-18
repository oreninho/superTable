export type ColumnType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiSelect' | 'custom';


export type RowData = {
    id: string
    [columnId: string]: any
}
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

export interface TableWithFilterProps  extends BaseTableDataProps {
    //todo? what should be here?
}
export interface TableWithSearchProps  extends BaseTableDataProps {
    //todo? what should be here?
}