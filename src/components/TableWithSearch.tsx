import React, {useState} from "react";
import {TableWithSearchProps} from "./types";
import Search from "./search";
import TableWithFilter from "./TableWithFilter";


const TableWithSearch: React.FC<TableWithSearchProps> = (props, context) => {
    const [searchValue,setSearchValue] = useState(""); //todo? search rows or search columns? from my understanding it should be rows
    const [filteredData,setFilteredData] = useState(props.initialData);




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
                console.log(e, row, key,searchValue);
            }

        }
        return false;
    }

    const applySearch = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setSearchValue(target.value); //todo: a bit odd, go back to this later
        const newFilteredData = filteredData.filter(row =>
            scanRow(row,searchValue)
        );
        console.log("len b4 and after",newFilteredData.length,filteredData.length);
        setFilteredData(newFilteredData);
    };
    return (
        <div>
            <Search value={searchValue} onChange={applySearch}/>
            <TableWithFilter {...props} initialData={filteredData}></TableWithFilter>
        </div>
    );
}
export default TableWithSearch;