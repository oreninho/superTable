import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {TableWrapperProps} from "./types";
import Search from "./search";
import TableWithFilter from "./TableWithFilter";
import {debounce} from "lodash";


const TableWithSearch: React.FC<TableWrapperProps> = (props, context) => {

    const originalData = useRef(props.initialData); // Store original data in a ref
    const [filteredData,setFilteredData] = useState(props.initialData);


    useEffect(() => {
        console.log('Filtered Data updated:', filteredData);
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
        const newFilteredData = originalData.current.filter(row =>
            scanRow(row,query)
        );
        setFilteredData(newFilteredData);
    }, 100);

    return (
        <div>
            <Search  onChange={applySearch}/>
            <TableWithFilter  columns={props.columns} initialData={filteredData}></TableWithFilter>
        </div>
    );
}
export default TableWithSearch;