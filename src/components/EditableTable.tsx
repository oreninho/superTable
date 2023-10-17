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
import React, {useState, useMemo, useEffect} from 'react';
import Header from './Header';
import Row from './Row';
import './editTable.scss';
import {toCamelCase} from "../services/utils";
import {TableDataProps} from "./types";






const EditableTable: React.FC<TableDataProps> = ({ initialData, columns }) => {
    const [data, setData] = useState(initialData);
    const [sortConfig, setSortConfig] = useState<{ key: string; ascending: boolean } | null>(null);

    const handleValueChange = (rowIndex: number, columnId: string, newValue: any) => {
        // Create a new array with the updated row
        const newData = data.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: newValue };
            }
            return row;
        });

        setData(newData);
    };


    const sortData = useMemo(() => {
        return (data: typeof initialData,sortConfig:{ key: string; ascending: boolean } | null) => {
            if (sortConfig !== null) {
                 const sorted = [...data].sort((a, b) => {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.ascending? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return !sortConfig.ascending ? 1 : -1;
                    }
                    console.log(a[sortConfig.key],b[sortConfig.key])
                    return 0;
                });
                setData(sorted);
                console.log(sorted);
            }
        };
    }, []);

    const requestSort = (key: string) => {
        let isAscending = true;
        if (sortConfig && sortConfig.key === key && sortConfig.ascending) {
            isAscending = false;
        }
        key = toCamelCase(key);
        setSortConfig({ key, ascending:isAscending });
        sortData(data,sortConfig);

    };

    return (
        <table className={"edit-table"}>
            <thead>
            <tr>
                {columns.map(column => (
                    <Header
                        key={column.id}
                        name={column.title}
                        onRequestSort={(key) => requestSort(key)}
                    />
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => (
                <Row
                    key={rowIndex}
                    row={row}
                    rowIndex={rowIndex}
                    columns={columns}
                    onValueChange={handleValueChange}
                />
            ))}
            </tbody>
        </table>
    );
};

export default EditableTable;
