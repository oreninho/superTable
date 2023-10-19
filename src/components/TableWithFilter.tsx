import React, {useContext, useEffect, useState} from 'react';
import Table from './EditableTable';
import './filterMenu.scss';
import {ColumnData, TableWrapperProps} from "./types";


const TableWithFilter: React.FC<TableWrapperProps> = ({initialData,columns}) => {

    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(columns);


    useEffect(() => {
        setVisibleColumns(columns);
        console.log('Table component rendered with data:', initialData);

    }, [initialData,columns]);
    const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
        const newVisibleColumns = isVisible ?
            [...visibleColumns, columns.find(column => column.id === columnId)]
            : visibleColumns.filter(column => column.id !== columnId);

            //maintain original order
            newVisibleColumns.sort((a,b) => a!.ordinalNo- b!.ordinalNo);
            //ts-ignore
            setVisibleColumns(newVisibleColumns as ColumnData);

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
