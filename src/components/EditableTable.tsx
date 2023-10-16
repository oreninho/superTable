//◆ The user should be able to write the new data directly into the data cell
// ◆ The user should be able to save the data
// how to save the data? on blur? on click? on enter? specific button? some alert?
// save on blur - quick and easy can be dangerous and not intuitive
// save on button - more intuitive but more clicks
//on blur + warning on exit - can have a lot of warnings, can be annoying

//how to save locally? redux? context? local storage?
//redux - overkill
//local storage - can be dangerous, can be slow, can be annoying
//context - can be slow, can be annoying

//searching - seems like a simple input with a button - can be done with a simple state - will be composed along with the table
//what will the search do? filter the data? highlight the data? show only the data? show only the data and hide the rest?,
// show the entire row of the specific search?

//grouping - the user should be able to group the data by a specific column, the user should be able to ungroup the data
// todo think about how to group the data

//sorting - the user should be able to sort the data by a specific column, the user should be able to sort the data by multiple columns??
//how to add the sorting? on click? on hover? on drag? on button? on blur? on enter? on specific button? on specific click?
// think of trading view - they have a lot of sorting options
import React, { useState, useMemo } from 'react';
import Header from './Header';
import Row from './Row';

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




const EditableTable: React.FC<TableDataProps> = ({ initialData, columns }) => {
    const [data, setData] = useState(initialData);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

    const sortedData = useMemo(() => {
        if (sortConfig !== null) {
            return [...data].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return data;
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className={"edit-table"}>
            <thead>
            <tr>
                {columns.map(column => (
                    <Header
                        key={column.id}
                        name={column.title}
                        onRequestSort={() => requestSort(column.title)}
                    />
                ))}
            </tr>
            </thead>
            <tbody>
            {sortedData.map((row, index) => (
                <Row key={index} data={row} />
            ))}
            </tbody>
        </table>
    );
};

export default EditableTable;
