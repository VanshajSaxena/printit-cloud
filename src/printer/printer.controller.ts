import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Controller({ path: 'printers', version: '1' })
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}

  @Post()
  async create(@Body() createPrinterDto: CreatePrinterDto) {
    return this.printerService.create(createPrinterDto);
  }

  @Get()
  async findAll() {
    return this.printerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.printerService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrinterDto: UpdatePrinterDto,
  ) {
    return this.printerService.update(id, updatePrinterDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.printerService.remove(id);
  }
}
