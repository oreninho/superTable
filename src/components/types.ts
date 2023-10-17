export interface TableDataProps {
    columns: Array<{
        id: string
        ordinalNo: number
        title: string
        type: string
        width?: number
    }>
    initialData: Array<{
        id: string
        [columnId: string]: any
    }>
}

export interface TableWithFilterProps  extends TableDataProps {
    //todo? what should be here?
}
export interface TableWithSearchProps  extends TableDataProps {
    //todo? what should be here?
}