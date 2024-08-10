import { SetStateAction, useContext, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Csv } from "../@types/csv"
import { CsvContext, CsvContextType, useCsvContext } from '../context/CsvContext';
import { ArrowRightRounded } from '@mui/icons-material';
import { ArrowLeftRounded } from '@mui/icons-material';

export const CsvTable = () => {

  const context = useCsvContext();

  const [table, setTable] = useState<Csv | null>(context.table)
  const [currStart, setCurrStart] = useState<number>(2)
  const [currIter, setIter] = useState<number>(5)
  // /**
  //  * Почему useEffect тут а не в App.tsx?
  //  * 
  //  * 
  //  */
  useEffect(() => {
    context.getTable("ex.csv", currStart, currIter)
    .then(
      new_table => {
        setTable(new_table)
        context.setTable(new_table)
        console.log("local", table, new_table)
      }
    )
  }, [])

  const handleGetNext = () => {
    context.getTable("ex.csv", currStart + currIter, currIter)
    .then(
      new_table => {
        setTable(new_table)
        context.setTable(new_table)
        console.log("local", table, new_table)
      }
    )

    setCurrStart(currStart + currIter)
  }

  const handleGetPrev = () => {
    if(currStart < 7) {
      alert("Выход за пределы таблицы")
    }
    else {
      context.getTable("ex.csv", currStart - currIter, currIter)
      .then(
        new_table => {
          setTable(new_table)
          context.setTable(new_table)
          console.log("local", table, new_table)
        }
      )
  
      setCurrStart(currStart - currIter)
    }
  }

  return(
    <div className="container">
      <div className='container-table'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {
                  context.table?.headers.map((name, index) => (
                    <TableCell key={index}>
                      {name}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {context.table?.rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {
                    row.map((name, index) => (
                      <TableCell>
                        {name}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      
      <div className='container-buttons'>
        <Stack spacing={2} direction="row">
          <IconButton aria-label="prev" size="large" style={{ background: "#d3d3d3"}} onClick={() => handleGetPrev()}>
            <ArrowLeftRounded />
          </IconButton>
          <IconButton aria-label="next" size="large" style={{ background: "#d3d3d3" }} onClick={() => handleGetNext()}>
            <ArrowRightRounded />
          </IconButton>
        </Stack>
      </div>
    </div>
  )
}