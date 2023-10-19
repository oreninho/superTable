import React, {useContext} from 'react';
import {CompleteTableData, } from "../components/types";


const defaultTableData:CompleteTableData = {
    initialData: [],
    columns: [],
    // any other default properties...
};
export const TableContext = React.createContext<CompleteTableData>(defaultTableData);

