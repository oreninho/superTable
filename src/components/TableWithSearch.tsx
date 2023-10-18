import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {TableWithSearchProps} from "./types";
import Search from "./search";
import TableWithFilter from "./TableWithFilter";
import {debounce} from "lodash";


const TableWithSearch: React.FC<TableWithSearchProps> = ({initialData,columns}, context) => {

    const originalData = useRef(initialData); // Store original data in a ref
    const [filteredData,setFilteredData] = useState(initialData);

    useEffect(() => {
        // Update originalData and filteredData when props.initialData changes
        originalData.current = initialData;
        setFilteredData(initialData);
    }, [initialData]);



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
        console.log("len b4 and after",newFilteredData.length,filteredData.length);
        setFilteredData(newFilteredData);
    }, 100);

    return (
        <div>
            <Search  onChange={applySearch}/>
            <TableWithFilter  columns={columns} initialData={filteredData}></TableWithFilter>
        </div>
    );
}
export default TableWithSearch;