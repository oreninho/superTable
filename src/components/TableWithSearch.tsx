import React, {useState} from "react";
import {TableWithSearchProps} from "./types";
import Search from "./search";
import TableWithFilter from "./TableWithFilter";


const TableWithSearch: React.FC<TableWithSearchProps> = (props, context) => {
    const [searchValue,setSearchValue] = useState(""); //todo? search rows or search columns? from my understanding it should be rows
    const [filteredData,setFilteredData] = useState(props.initialData);




    const scanRow = (row: any,query:string) => {
        for (let key in row) {
            if (row[key].toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    const applySearch = () => {
        const newFilteredData = filteredData.filter(row =>
            scanRow(row,searchValue)
        );
        setFilteredData(newFilteredData);
    };
    return (
        <div>
            <Search value={searchValue} onClick={applySearch}/>
            <TableWithFilter {...props} initialData={filteredData}></TableWithFilter>
        </div>
    );
}
export default TableWithSearch;