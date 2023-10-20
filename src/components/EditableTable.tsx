//◆ The user should be able to write the new data directly into the data cell
// ◆ The user should be able to save the data
// how to save the data? on blur? on click? on enter? specific button? some alert?
// save on blur - quick and easy can be dangerous and not intuitive
// save on button - more intuitive but more clicks
//on blur + warning on exit - can have a lot of warnings, can be annoying

//how to save locally? redux? context? local storage?
//redux
//local storage
//context

//searching - seems like a simple input with a button - can be done with a simple state - will be composed along with the table
//what will the search do? filter the data? highlight the data? show only the data? show only the data and hide the rest?,
// show the entire row of the specific search?


//sorting - the user should be able to sort the data by a specific column, the user should be able to sort the data by multiple columns??
//how to add the sorting? on click? on hover? on drag? on button? on blur? on enter? on specific button? on specific click?
// think of trading view - they have a lot of sorting options
import React, {useState, useMemo, useEffect, useContext} from 'react';
import Header from './Header';
import Row from './Row';
import './editTable.scss';
import {toCamelCase} from "../services/utils";
import {BaseTableDataProps, RowData, RowsData,} from "./types";
import tableDataService from "../services/data/tableDataService";
import PaginationControllers from "./PaginationControllers";

//component looks a bit messy - maybe split it into smaller components?


type EditableTableState = {
    data: RowsData;
    page: number;
    itemsPerPage: number;
    totalPageNumbers: number;
    sortConfig: { key: string; ascending: boolean } | null;
}

const EditableTable: React.FC<BaseTableDataProps> = ({ initialData,columns }) => {
    const initialState: EditableTableState = {
        data: initialData,
        page: 1,
        itemsPerPage: 20,
        totalPageNumbers: Math.ceil(initialData.length / 20),
        sortConfig: null,
    }
    const [tableState, setTableState] = useState(initialState);

    const { data, page, itemsPerPage, totalPageNumbers, sortConfig } = tableState;

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        if (!initialData || initialData.length === 0 || columns.length === 0 ) return;
        let groups = groupBy(initialData,columns[0].id);
        const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);
        const totalPageNumbers = Math.ceil(groups.length / itemsPerPage);
        setTableState(prev => ({...prev, data: currentItems, totalPageNumbers}));

    }, [initialData,page,itemsPerPage]);


    const getOffset = (page: number, itemsPerPage: number) => {
        return (page - 1) * itemsPerPage;
    }

    const handleNextPage = () => {
        if (page < tableState.totalPageNumbers) {
            setTableState(prev => ({...prev, page: prev.page + 1}));
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setTableState(prev => ({...prev, page: prev.page - 1}));
        }
    };

    const handlePageNumberClick = (pageNumber: number) => {
        setTableState(prev => ({...prev, page: pageNumber}));
    };
    const handleValueChange = async (rowIndex: number, columnId: string, newValue: any) => {
        // Create a new array with the updated row
        const newData = data.map((row, index) => {
            let offset = getOffset(page,itemsPerPage);
            if ((index + offset) === rowIndex) {
                let updatedRow = {...row, [columnId]: newValue};
                tableDataService.updateData(updatedRow)
                return updatedRow;
            }
            return row;
        });
        setTableState(prev => ({...prev, data: newData}));
    };

    const sortData =  (data: RowsData ,sortConfig:{ key: string; ascending: boolean } | null) => {
            if (sortConfig !== null) {
                 const sorted = [...data].sort((a, b) => {
                     let prev = a[sortConfig.key];
                     let next = b[sortConfig.key];
                     //not exactly sure how to sort selection lists
                     if (typeof prev !== 'object') {
                         if (prev < next) {
                             return sortConfig.ascending ? -1 : 1;
                         }
                         if (prev > next) {
                             return !sortConfig.ascending ? 1 : -1;
                         }
                     }
                    return 0;
                });
                setTableState(prevState => ({...prevState, data: sorted}));
                console.log(sorted);
            }
        };


    function groupBy<T extends RowData>(array: T[], key: string): T[] {
        const group = array.reduce((result, currentValue) => {
            const keyValue = String(currentValue[key]);

            if (!result[keyValue]) {
                result[keyValue] = {...currentValue, children: []};
            }
            result[keyValue].children!.push(currentValue);
            return result;
        }, {} as Record<string, T>);

        // Return an array of the group objects
        return Object.values(group);
    }
    const requestSort = (key: string) => {
        let isAscending = true;
        if (sortConfig && sortConfig.key === key && sortConfig.ascending) {
            isAscending = false;
        }
        key = toCamelCase(key);
        setTableState(prevState => ({...prevState, sortConfig: { key, ascending: isAscending }}));
        sortData(data,sortConfig);
    };

    return (
        <div>
            <table className={"edit-table"}>
                <thead>
                <tr>
                    {columns.map(column => (
                        <Header
                            key={column.id}
                            name={column.title}
                            ascending={sortConfig && sortConfig.key === column.id ? sortConfig.ascending : false}
                            onRequestSort={(key) => requestSort(key)}
                        />
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <Row
                        key={rowIndex+getOffset(page,itemsPerPage)}
                        row={row}
                        rowIndex={rowIndex+getOffset(page,itemsPerPage)}
                        columns={columns}
                        children={row.children}
                        onValueChange={handleValueChange}
                    />
                ))}
                </tbody>
            </table>
            <PaginationControllers currentPage={page} totalPageNumbers={totalPageNumbers}
                                  onPageNumberClick={handlePageNumberClick} onPreviousPageClick={handlePreviousPage} onNextPageClick={handleNextPage} />
        </div>
    );
}

export default EditableTable;
