import React, {useEffect, useRef, useState} from 'react';
import './filterMenu.scss';
import {ColumnData, TableWrapperProps} from "./types";


const TableWithFilter: React.FC<TableWrapperProps> = ({initialData,columns,children}) => {

    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVisibleColumns(columns);
        console.log('Table component rendered with data:', initialData);

    }, [columns]);

    useEffect(() => {
        const handleClickOutside = (event:Event) => {

            const target = event.target as HTMLElement;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setShowFilterMenu(false);
            }
        };

        // Attach the click event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup: remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
        const newVisibleColumns = isVisible ?
            [...visibleColumns, columns.find(column => column.id === columnId)]
            : visibleColumns.filter(column => column.id !== columnId);

            //maintain original order
            newVisibleColumns.sort((a,b) => a!.ordinalNo- b!.ordinalNo);

            setVisibleColumns(newVisibleColumns as ColumnData);
    };

    return (
        <div>
            <button className={"filter-button"} onClick={() => setShowFilterMenu(!showFilterMenu)}>Filter menu</button>
            {
                showFilterMenu &&
                <div className="filter-menu"  ref={menuRef}>
                    {columns.map(column => (
                        <div key={column.id} ref={menuRef} >
                            <label>
                                {column.title}
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.some(visibleColumn => visibleColumn.id === column.id)}
                                    onChange={(e) =>{
                                        handleColumnVisibilityChange(column.id, e.target.checked)
                                        }}
                                />
                            </label>
                        </div>
                    ))}
                </div>
            }
            {children && children(visibleColumns,initialData) }
        </div>
    );
};

export default TableWithFilter;
