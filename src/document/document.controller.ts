import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentBatchRequestDto } from './dto/create-document-batch-request.dto';
import { CreateDocumentResponseDto } from './dto/create-document-response.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller({ path: 'documents', version: '1' })
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  async create(
    @Body() createDocumentBatchDto: CreateDocumentBatchRequestDto,
  ): Promise<CreateDocumentResponseDto> {
    return this.documentService.create(createDocumentBatchDto);
  }

  @Get()
  async findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.remove(id);
  }
}
