import React, {useEffect, useState} from 'react';
import './App.scss';

import TableWithSearch from "./components/TableWithSearch";
import {dataService} from "./services/data/dataService";
import {LocalStorageBehaviour} from "./services/data/localStorageBehaviour";
import tableDataService from "./services/data/tableDataService";
import {ColumnData, CompleteTableData} from "./components/types";
import FileUploader from "./components/FileUploader";


//todo bugs: sort doesn't work on new data, input field doesn't work on new data from upload, think of thre usecallback in fileruploader
//todo another dilemma - should the data be streamed or loaded all at once? I think it should be streamed, but then the pagination and sorting will be a bit more complicated
function App() {

    const [tableData,setTableData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            console.log("Initializing session");
            dataService.init(new LocalStorageBehaviour());

        })();
    }, []);

    //todo move to separate component, perhaps the table itself? I think its not the table component concern to load the data
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


    if (loading) return <div>"Loading..."</div>;
  return (
    <div className="App">
      <header className="App-header">
          <FileUploader onLoadFile={handleFileLoaded}/>
          {<TableWithSearch initialData={tableData.initialData} columns={tableData.columns} />}
      </header>
    </div>
  );
}

export default App;
