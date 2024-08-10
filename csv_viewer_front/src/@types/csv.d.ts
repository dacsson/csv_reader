export type Csv = {
  headers: string[];
  rows: string[][];
  rows_count: number;
  columns_count: number;

  // constructor(headers: string[], rows: string[][], rows_count: number, columns_count: number) {
  //   this.headers = headers;
  //   this.rows = rows;
  //   this.rows_count = rows_count;
  //   this.columns_count = columns_count;
  // }
}