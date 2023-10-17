import React from 'react';
import './App.css';
import EditableTable from "./components/EditableTable";
import TableWithFilter from "./components/TableWithFilter";
import TableWithSearch from "./components/TableWithSearch";
const data = require('./data/mocked-data.json');



function App() {
    const [tableData,setTableData] = React.useState(data);
    console.log(data)

  return (
    <div className="App">
      <header className="App-header">
      <TableWithSearch initialData={tableData.rows} columns={tableData.columns} />
      </header>
    </div>
  );
}

export default App;
