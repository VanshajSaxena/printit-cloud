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
import { DocumentService } from './print-document.service';
import { CreateDocumentDto } from './dto/create-print-document.dto';
import { UpdateDocumentDto } from './dto/update-print-document.dto';

@Controller({ path: 'documents', version: '1' })
export class DocumentController {
  constructor(private readonly printDocumentService: DocumentService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.printDocumentService.create(createDocumentDto);
  }

  @Get()
  async findAll() {
    return this.printDocumentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.printDocumentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.printDocumentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.printDocumentService.remove(id);
  }
}
