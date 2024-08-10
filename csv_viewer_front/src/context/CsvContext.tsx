import { createContext, SetStateAction, Dispatch, useContext } from "react";
import { Csv } from "../@types/csv";

export type CsvContextType = {
  table: Csv | null,
  setTable: Dispatch<SetStateAction<Csv | null>>
  getTable: (filename: string, start_row: number, count: number) => Promise<Csv>
};

export const CsvContext = createContext<CsvContextType | null>(null)

export const useCsvContext = () => {
  const currentCsvContext = useContext<CsvContextType | null>(CsvContext);

  if (!currentCsvContext) {
    throw new Error(
      "No provider for context"
    );
  }

  return currentCsvContext;
};