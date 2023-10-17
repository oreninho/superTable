import React, { useState } from 'react';
import Table from './EditableTable';

interface TableWrapperProps {
    initialData: Array<{
        id: string
        [columnId: string]: any
    }>
    columns: Array<{
        id: string
        ordinalNo: number
        title: string
        type: string
        width?: number
    }>
}

const TableWithFilter: React.FC<TableWrapperProps> = ({ initialData, columns }) => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(columns);

    const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
        const newVisibleColumns = isVisible ?
            [...visibleColumns, columns.find(column => column.id === columnId)]
            : visibleColumns.filter(column => column.id !== columnId);

            if (newVisibleColumns.length === 0 ) {
                // Prevent hiding all columns
                return;
            }
            else{
                // @ts-ignore
                setVisibleColumns(newVisibleColumns); //todo: check this
            }

    };

    return (
        <div>
            <button className={"filter-button"} onClick={() => setShowFilterMenu(!showFilterMenu)}>Filter menu</button>
            {
                showFilterMenu &&
                <div className="filter-menu">
                    {columns.map(column => (
                        <div key={column.id}>
                            <label>
                                {column.title}
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.some(visibleColumn => visibleColumn.id === column.id)}
                                    onChange={(e) => handleColumnVisibilityChange(column.id, e.target.checked)}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            }


            <Table initialData={initialData} columns={visibleColumns} /> {/* Pass the visible columns as a prop */}
        </div>
    );
};

export default TableWithFilter;
