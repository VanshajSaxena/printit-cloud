import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrintDocumentService } from './print-document.service';
import { CreatePrintDocumentDto } from './dto/create-print-document.dto';
import { UpdatePrintDocumentDto } from './dto/update-print-document.dto';

@Controller({ path: 'documents', version: '1' })
export class PrintDocumentController {
  constructor(private readonly printDocumentService: PrintDocumentService) {}

  @Post()
  async create(@Body() createPrintDocumentDto: CreatePrintDocumentDto) {
    return this.printDocumentService.create(createPrintDocumentDto);
  }

  @Get()
  async findAll() {
    return this.printDocumentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.printDocumentService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrintDocumentDto: UpdatePrintDocumentDto,
  ) {
    return this.printDocumentService.update(+id, updatePrintDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.printDocumentService.remove(+id);
  }
}
