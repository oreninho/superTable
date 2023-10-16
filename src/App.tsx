import React from 'react';
import './App.css';
import EditableTable from "./components/EditableTable";
const data = require('./data/mocked-data.json');



function App() {
    console.log(data)
  return (
    <div className="App">
      <header className="App-header">
      <EditableTable initialData={data.rows} columns={data.columns} />
      </header>
    </div>
  );
}

export default App;
