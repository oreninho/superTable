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
//todo - some issues - when handling large data sets, the initial grouping is slow, the sorting is slow, the pagination is slow
import React, {useState, useMemo, useEffect, useContext} from 'react';
import Header from './Header';
import Row from './Row';
import './editTable.scss';
import {toCamelCase} from "../services/utils";
import {BaseTableDataProps, RowData, RowsData,} from "./types";
import tableDataService from "../services/data/tableDataService";
import PaginationControllers from "./PaginationControllers";

//component looks a bit messy - maybe split it into smaller components?


type TableState = {
    tableData: RowsData;
    totalPageNumbers: number;
    sortConfig: { key: string; ascending: boolean } | null;
}

type PageState = {
    page: number;
    itemsPerPage: number;
    pageData: RowsData;
}


const ITEMS_PER_PAGE = 30;

const EditableTable: React.FC<BaseTableDataProps> = ({ initialData,columns }) => {

    const initialPageState: PageState = {
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE,
        pageData: [],
    }

    const initialState: TableState = {
        tableData: [],
        totalPageNumbers: Math.ceil(initialData.length / ITEMS_PER_PAGE),
        sortConfig: null,
    }

    const [tableState, setTableState] = useState(initialState);
    const [pageState, setPageState] = useState(initialPageState);

    const { tableData,totalPageNumbers, sortConfig } = tableState;
    const { page, itemsPerPage, pageData } = pageState;

    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        if (!initialData || initialData.length === 0 || columns.length === 0 ) return;
        let groups = groupBy(initialData,columns[0].id);
        const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);
        const totalPageNumbers = Math.ceil(groups.length / itemsPerPage);
        setTableState(prev => ({...prev, tableData: groups, totalPageNumbers}));
        setPageState(prev => ({...prev, pageData: currentItems, page}));

    }, [initialData]);

    useEffect(() => {
        const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
        setPageState(prev => ({...prev, pageData: currentItems}));
    }, [tableData,page]);

    const getOffset = (page: number, itemsPerPage: number) => {
        return (page - 1) * itemsPerPage;
    }

    const handleNextPage = () => {
        if (page < totalPageNumbers) {
            setPageState(prev => ({...prev, page: prev.page + 1}));
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPageState(prev => ({...prev, page: prev.page - 1}));
        }
    };

    const handlePageNumberClick = (pageNumber: number) => {
        setPageState(prev => ({...prev, page: pageNumber}));
    };
    const handleValueChange = async (rowIndex: number, columnId: string, newValue: any) => {
        // Create a new array with the updated row
        const newData = pageData.map((row, index) => {
            let offset = getOffset(page,itemsPerPage);
            if ((index + offset) === rowIndex) {
                let updatedRow = {...row, [columnId]: newValue};
                tableDataService.updateData(updatedRow)
                return updatedRow;
            }
            return row;
        });
        setTableState(prev => ({...prev, tableData: newData}));
        setPageState(prev => ({...prev, pageData: newData}));
    };

    //sort the entire data set? or this page only?
    const sortData = (data: RowsData, sortConfig: { key: string; ascending: boolean } | null) => {
        if (sortConfig !== null) {
            const sorted:RowData[] = [...data].sort((a, b) => {
                let prev = a[sortConfig.key];
                let next = b[sortConfig.key];

                if (!isNaN(prev) && !isNaN(next)) {
                    return sortConfig.ascending ? prev - next : next - prev;
                }

                if (typeof prev === 'string' && typeof next === 'string') {
                    return sortConfig.ascending ? prev.localeCompare(next) : next.localeCompare(prev);
                }
                if (typeof prev === 'boolean' && typeof next === 'boolean') {
                    return sortConfig.ascending ? Number(prev) - Number(next) : Number(next) - Number(prev);
                }

                return 0;
            });
            const pageData = sorted.slice(indexOfFirstItem, indexOfLastItem);
            setTableState(prevState => ({ ...prevState, tableData: sorted }));
            setPageState(prevState => ({ ...prevState, pageData }));
            console.log(tableData);
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
        key = toCamelCase(key);

        let isAscending = true;
        if (sortConfig && sortConfig.key === key && sortConfig.ascending) {
            isAscending = false;
        }

        const newSortConfig = { key, ascending: isAscending };
        setTableState(prevState => ({...prevState, sortConfig: newSortConfig }));
        sortData(initialData, newSortConfig);
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
                            id={column.id}
                            ascending={sortConfig && sortConfig.key === column.id ? sortConfig.ascending : false}
                            onRequestSort={(key) => requestSort(key)}
                        />
                    ))}
                </tr>
                </thead>
                <tbody>
                {pageData.map((row, rowIndex) => (
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
