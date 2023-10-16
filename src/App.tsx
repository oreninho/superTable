import React from 'react';
import logo from './logo.svg';
import './App.css';
import EditableTable from "./components/EditableTable";



function App() {
  return (
    <div className="App">
      <header className="App-header">
      <EditableTable initialData={[]} columns={[]} />
      </header>
    </div>
  );
}

export default App;
