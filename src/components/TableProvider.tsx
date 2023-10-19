import React, {useContext, useEffect, useState} from 'react';
import {TableContext} from "../services/tableContext";
import tableDataService from "../services/data/tableDataService";
import {CompleteTableData} from "./types";
import FileUploader from "./FileUploader";


interface TableProviderProps {

    children: React.ReactNode;
}

const TableProvider: React.FC<TableProviderProps> = ({children }) => {
    const [tableData, setTableData] = useState<CompleteTableData>({
        initialData: [],
        columns: [],
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {

                const curData = await tableDataService.getData<CompleteTableData>();
                console.log("curData", curData);

                if (!curData || !curData.columns) {
                    throw new Error("No valid data received");
                }

                console.log("tableData", curData);
                setLoading(false);
                setTableData(curData);
            } catch (e) {
                setLoading(true);
            }
        };

        if (loading) {
            fetchData();
        }
    }, [loading]);
    const loadFile = async (file: File): Promise<CompleteTableData> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const content = event.target?.result as string;
                    console.log("content", content);
                    const data = JSON.parse(content) as CompleteTableData;
                    await tableDataService.setData(data);
                    resolve(data);
                } catch (error) {
                    reject(`Error parsing file: ${error}`);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleFileLoaded = async (file: File) => {
        try {
            const data = await loadFile(file);
            setTableData(data);
        } catch (error) {
            console.error(error);
        }
    };
    return (

        <TableContext.Provider value={tableData}>
            <FileUploader onLoadFile={handleFileLoaded}/>
            {children}
        </TableContext.Provider>
    );
}
const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error("useTableContext must be used within a TableProvider");
    }
    return context;
};
export {useTableContext,TableProvider};
