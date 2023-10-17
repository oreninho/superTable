import React from 'react';
import './App.css';
import EditableTable from "./components/EditableTable";
import TableWithFilter from "./components/TableWithFilter";
const data = require('./data/mocked-data.json');



function App() {
    console.log(data)
  return (
    <div className="App">
      <header className="App-header">
      <TableWithFilter initialData={data.rows} columns={data.columns} />
      </header>
    </div>
  );
}

export default App;
