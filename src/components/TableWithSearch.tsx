import React, {useCallback, useEffect, useReducer, useState} from "react";
import {TableWithSearchProps} from "./types";
import Search from "./search";
import TableWithFilter from "./TableWithFilter";
import {debounce} from "lodash";


const TableWithSearch: React.FC<TableWithSearchProps> = (props, context) => {
   // const [searchValue,setSearchValue] = useState(""); //todo? search rows or search columns? from my understanding it should be rows
    const [filteredData,setFilteredData] = useState(props.initialData);
        const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        console.log('Filtered Data updated:', filteredData);
        forceUpdate(); //todo:temp should be removed
    }, [filteredData]);


    const scanRow = (row: any,query:string) => {
        console.log("scanning row",query);
        for (let key in row) {
            try {
                let value = row[key];
                let valueStr = "";
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    valueStr = value.toString().toLowerCase();
                } else if (typeof value === 'object') {
                    // Convert JSON objects to string for searching purposes
                    valueStr = JSON.stringify(value).toLowerCase();
                }
                if (valueStr.includes(query.toLowerCase())) {
                    return true;
                }
            }
            catch (e) {
                console.log(e, row, key,query);
            }

        }
        return false;
    }

    const applySearch = debounce ((query:string) => {
        const newFilteredData = filteredData.filter(row =>
            scanRow(row,query)
        );
        console.log("len b4 and after",newFilteredData.length,filteredData.length);
        setFilteredData(newFilteredData);
    }, 100);

    return (
        <div>
            <Search  onChange={applySearch}/>
            <TableWithFilter {...props} initialData={filteredData}></TableWithFilter>
        </div>
    );
}
export default TableWithSearch;