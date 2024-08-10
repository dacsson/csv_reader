import { Injectable } from '@nestjs/common';
import { readFile, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import { CreateCsvDto } from './dto/create-csv.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';
import { FileUploadDto } from './dto/upload-file.dto';
import { Csv } from './entities/csv.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class CsvService {
  /**
   * посчитать количество строк в файле 
   * @param src 
   * @returns Количество строк
   */
  count_lines(src: string) {
    var n = 0;
    for(var i = 0;  i < src.length; i++ ) {
        if(src[i] === '\n') {
            n++;
        }
    }
    return n;
  }

  /**
   * Ищет индекс n-го повторения подстроки в строке 
   * @param string Строка в которой ищем
   * @param sub_string Подстрока которую ищем
   * @param n Какое повторение найти 
   * @returns Индекс в строке 
   * @example
   * // returns 16
   * get_pos("ART JOM YOU KEE YOU", "YOU", 2)
   */
  get_pos(string: string, sub_string: string, n: number) {
    var it = 0;
    var index = 0;
    while(it != n) {
      index = string.indexOf(sub_string, index);
      index++;
      it++;
    }

    return index;
  }

  /**
   * Считать строку 
   * Можно было бы справиться и без этого метода, но было интересно самому написать лексеро-подобную функцию
   * @param content Текст из файла
   * @param i Позиция в файле на данный момент
   * @returns Пару из прочитанных слов (массив строк) и позиция в файле на данный момент
   */
  read_line(content: string, i: number) : {values: string[], pos: number} {
    var word = "";
    var values = [];

    while(content.charAt(i) != '\n') {
      if(content.charAt(i) != ',' && content.charAt(i - 1) != "\"") {
        var char = content.charAt(i - 1);
        word += char;
        i++;
      } 
      else if(content.charAt(i) == ',') {
        // Logger.log(word)
        values.push(word)
        i+=2;
        word = "";
      }
      else {
        i++;
      }
    }

    return {values: values, pos: i+1};
  }

  /**
   * Сохранить новый csv файл в хранилище
   * @param csv_buff 
   */
  create(csv_buff: Buffer) {
    var path = join(__dirname, "..", "..", "data", "ex.csv");
    writeFile(path , csv_buff, {
      flag: 'w+'
    } , (err) => {
      if(err) {
        throw new Error(err.message)
      }
    });    
  }

  /**
   * Считать подтаблицу* CSV-файла
   * @param file_name Имя файла
   * @param from С какой строки начать чтение
   * @param to_count Сколько строк прочитать
   * @returns {Csv} Подтаблицу с {from} + {to_count} количеством строк и заголовками
   */
  parse(file_name: string, from: number, to_count: number): Csv {
    if(from <= 1) {
      throw new RangeError("Reading headers")
    }

    from--;

    var path = join(__dirname, "..", "..", "data") + "/" + file_name; 
    var content = readFileSync(path , 'utf-8'); 

    var lines_count = this.count_lines(content);
    if(from > lines_count || ((+from + +to_count) > lines_count)) {
      throw new RangeError("Exceeded lines limit")
    }

    var headers = [];
    var rows_count, columns_count;

    // read column names
    var obj = this.read_line(content, 1)
    headers = obj.values;

    var start_row_id = this.get_pos(content, "\n", from)
    
    var dest : number = +from + +to_count
    var end_row_id = this.get_pos(content, "\n", dest)

    var i = start_row_id;

    var rows: string[][] = []
    while(i < end_row_id) {
      var row = [];
      obj = this.read_line(content, i);
      row = obj.values;
      i = obj.pos;

      rows.push(row)
    }

    rows_count = rows.length;

    var csv : Csv  = new Csv(headers, rows, rows_count, columns_count);

    return csv;
  }
}
