import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpException, HttpStatus, StreamableFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CsvService } from './csv.service';
import { CreateCsvDto } from './dto/create-csv.dto';
import { ReqRows } from './dto/req-rows.dto';
import { UpdateCsvDto } from './dto/update-csv.dto';
import { FileUploadDto } from './dto/upload-file.dto';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto
  })
  @UseInterceptors(FileInterceptor('file'))
  upload_file(@UploadedFile() file: Express.Multer.File) {
    console.log(file.originalname, file.buffer.byteLength)
    this.csvService.create(file.buffer)
  }

  @Get("get_rows")
  @ApiQuery({ name: 'file_name', type: 'string' })
  @ApiQuery({ name: 'start_row', type: 'number' })
  @ApiQuery({ name: 'count', type: 'number' })
  parse(@Query() query: ReqRows) {
    console.log()
    try {
      var content = this.csvService.parse(query.file_name, query.start_row, query.count);
      // console.log(content)
      return content;
    }
    catch(e) {
      console.log(e)
      throw new HttpException(e, HttpStatus.NOT_FOUND);
    }
  }

  @Get("stream/:file_name")
  stream(@Param('file_name') file_name: string) : StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'))
    return new StreamableFile(file);
  }
  // @Post()
  // create(@Body() createCsvDto: CreateCsvDto) {
  //   return this.csvService.create(createCsvDto);
  // }

  // @Get('upload')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'string',
  //     format: 'binary'
  //   }
  // })
  // @UseInterceptors(FileInterceptor('file'))
  // parse_csv_file(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  // @Get()
  // findAll() {
  //   return this.csvService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.csvService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCsvDto: UpdateCsvDto) {
  //   return this.csvService.update(+id, updateCsvDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.csvService.remove(+id);
  // }
}
