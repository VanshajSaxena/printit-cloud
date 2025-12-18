import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrintJobService } from './print-job.service';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { UpdatePrintJobDto } from './dto/update-print-job.dto';

@Controller('print-job')
export class PrintJobController {
  constructor(private readonly printJobService: PrintJobService) {}

  @Post()
  create(@Body() createPrintJobDto: CreatePrintJobDto) {
    return this.printJobService.create(createPrintJobDto);
  }

  @Get()
  findAll() {
    return this.printJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrintJobDto: UpdatePrintJobDto) {
    return this.printJobService.update(+id, updatePrintJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printJobService.remove(+id);
  }
}
