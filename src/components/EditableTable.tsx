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
        console.log("editable table useEffect, initialData");
        let groups =  tableDataService.groupBy(initialData,columns[0].id);
        const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);
        const totalPageNumbers = Math.ceil(groups.length / itemsPerPage);
        setTableState(prev => ({...prev, tableData: groups, totalPageNumbers}));
        setPageState(prev => ({...prev, pageData: currentItems, page}));

    }, [initialData]);

    useEffect(() => {
        console.log("editable table useEffect, page");
        const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
        setPageState(prev => ({...prev, pageData: currentItems}));
    }, [tableData,page,indexOfFirstItem,indexOfLastItem]);

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

    const updateRow = async (updatedRow: RowData) => {
        await tableDataService.updateData(updatedRow,{initialData:tableData, columns});
        setTableState(prev => ({
            ...prev,
            tableData: prev.tableData.map(row => row.id === updatedRow.id ? updatedRow : row)
        }));
        setPageState(prev => ({
            ...prev,
            pageData: prev.pageData.map(row => row.id === updatedRow.id ? updatedRow : row)
        }));
    }
    const handleValueChange = async (rowId: string, columnId: string, newValue: any) => {
        for (let row of pageData) {
            if (row.id === rowId) {
                const updatedRow = {...row, [columnId]: newValue};
                await updateRow(updatedRow);
                return;
            }
            if (row.children) {
                for (let i in row.children) {
                    if (row.children[i].id === rowId) {
                        const updatedChild = {...row.children[i], [columnId]: newValue};
                        const updatedRow = {...row, children: row.children.map(child => child.id === rowId ? updatedChild : child)};
                        await updateRow(updatedRow);
                        return;
                    }
                }
            }
        }
    };

    //sort the entire data set? or this page only?
    const sortData = (data: RowsData, sortConfig: { key: string; ascending: boolean } | null) => {
        console.log("sortData",data,sortConfig);
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
        }
    };

    const requestSort = (key: string) => {
        key = toCamelCase(key);

        let isAscending = true;
        if (sortConfig && sortConfig.key === key && sortConfig.ascending) {
            isAscending = false;
        }

        const newSortConfig = { key, ascending: isAscending };
        setTableState(prevState => ({...prevState, sortConfig: newSortConfig }));
        sortData(tableData, newSortConfig);
    };

    return (
        <div>
            <table className={"edit-table"}>
                <thead>
                <tr>
                    {columns.map(column => (
                        <Header key={column.id} name={column.title} id={column.id} ascending={sortConfig && sortConfig.key === column.id ? sortConfig.ascending : false}
                            onRequestSort={(key) => requestSort(key)}/>))}
                </tr>
                </thead>
                <tbody>
                {pageData.map((row, rowIndex) => (
                    <Row
                        key={rowIndex+getOffset(page,itemsPerPage)}
                        row={row}
                        parentRowIndex={rowIndex+getOffset(page,itemsPerPage)}
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
