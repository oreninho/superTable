import React, {useEffect, useState} from 'react';
import './App.scss';

import TableWithSearch from "./components/TableWithSearch";
import {dataService} from "./services/data/dataService";
import {LocalStorageBehaviour} from "./services/data/localStorageBehaviour";
import tableDataService from "./services/data/tableDataService";
import { CompleteTableData} from "./components/types";
import FileUploader from "./components/FileUploader";
import EditableTable from "./components/EditableTable";
import TableWithFilter from "./components/TableWithFilter";


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
                return curData;
            } catch (e) {
                setLoading(true);
            }
        };
        if (loading) {
             fetchData();
        }
    }, [loading,tableData]);


    const handleFileLoaded = async (file: File) => {
        try {
            const data = await tableDataService.loadFile<CompleteTableData>(file);
            await tableDataService.setData(data)
            console.log("data from file", data);
            setLoading(false);
            setTableData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const onMockGenerate = async () => {
        try {
            const data = await tableDataService.getMockData<CompleteTableData>();
            console.log("data from file", data);
            // await tableDataService.setData(data)
            // setTableData(data);
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div className="App">
      <header className="App-header">
          <div className={"additional-actions"}>
            <FileUploader onLoadFile={handleFileLoaded}/>
              <button className={""} onClick={onMockGenerate} > Generate Data </button>
          </div>
            {loading && <div>Loading...</div>}
          {!loading && <TableWithSearch initialData={tableData.initialData} columns={tableData.columns} >
              {(columns,initialData) =>
                  <TableWithFilter columns={columns} initialData={initialData}>
                        {(columns,initialData) =>
                            <EditableTable columns={columns} initialData={initialData} onDataChange={setTableData}/>}
                  </TableWithFilter>
            }
            </TableWithSearch>}
      </header>
    </div>
  );
}

export default App;
