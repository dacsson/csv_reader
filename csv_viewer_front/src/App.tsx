import React, { useEffect, useState } from 'react';
import { Csv } from './@types/csv';
import './App.css';
import { CsvTable } from './components/CsvTable';
import { CsvContext } from './context/CsvContext';

function App() {
  const csv_table: Csv = {headers: ["art", "yom"], rows: [["1", "2"], ["3", "4"]], columns_count: 2, rows_count: 2}

  const [table, setTable] = useState<Csv | null>(null);

  const getTable = async (filename: string, start_row: number, count: number) : Promise<Csv> => {
    var new_csv : Csv = {
      headers: [],
      rows: [],
      rows_count: 0,
      columns_count: 0
    };

    var url = new URL('http://localhost:5000/csv/get_rows')
    var params = { count: count.toString(), start_row: start_row.toString(), file_name: filename }
    url.search = new URLSearchParams(params).toString()

    // console.log(url.toString())

    new_csv = await fetch(url)
    .then(
      res => res.json()
    )
    .then(
      data => { return data }
    )

    console.log("about to return", new_csv)
    return new_csv;
  }

  // useEffect(() => {
  //   var new_table = getTable("ex.csv", 4, 6);
  //   setTable(new_table)
  // }, [])

  return (
    <CsvContext.Provider value={{ table, setTable, getTable }}>
      <CsvTable/>
    </CsvContext.Provider>
  );
}

export default App;
