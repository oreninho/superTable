import React, {useEffect, useState} from 'react';
import './App.css';

import TableWithSearch from "./components/TableWithSearch";
import {dataService} from "./services/data/dataService";
import {LocalStorageBehaviour} from "./services/data/localStorageBehaviour";
import tableDataService from "./services/data/tableDataService";
import {CompleteTableData} from "./components/types";
//const data = require('./data/mocked-data.json');

//todo bugs: sort doesn't work on new data

function App() {

    const [tableData,setTableData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            console.log("Initializing session");
            dataService.init(new LocalStorageBehaviour());

        })();
    }, []);

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


    if (loading) return <div>"Loading..."</div>;
  return (

    <div className="App">
      <header className="App-header">
          {<TableWithSearch initialData={tableData.initialData} columns={tableData.columns} />}
      </header>
    </div>
  );
}

export default App;
