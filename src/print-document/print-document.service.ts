import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrintDocumentDto } from './dto/create-print-document.dto';
import { UpdatePrintDocumentDto } from './dto/update-print-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintDocument } from './entities/print-document.entity';
import { Repository } from 'typeorm';
import { DocumentStatus } from './enums/document-status.enum';
import { plainToInstance } from 'class-transformer';
import { PrintDocumentResponseDto } from './dto/print-document-response.dto';

@Injectable()
export class PrintDocumentService {
  constructor(
    @InjectRepository(PrintDocument)
    private printDocumentRepository: Repository<PrintDocument>,
  ) {}

  async create(createPrintDocumentDto: CreatePrintDocumentDto) {
    const newPrintDocument = this.printDocumentRepository.create(
      createPrintDocumentDto,
    );
    newPrintDocument.status = DocumentStatus.PENDING;
    const saved = await this.printDocumentRepository.save(newPrintDocument);
    return plainToInstance(PrintDocumentResponseDto, saved);
  }

  async findAll() {
    return this.printDocumentRepository.find();
  }

  async findOne(id: number) {
    return this.printDocumentRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePrintDocumentDto: UpdatePrintDocumentDto,
  ): Promise<PrintDocument> {
    const printDocument = await this.printDocumentRepository.findOneBy({ id });
    if (!printDocument) {
      throw new NotFoundException(`PrintDocument not found for the id: ${id}`);
    }
    Object.assign(printDocument, updatePrintDocumentDto);
    return this.printDocumentRepository.save(printDocument);
  }

  async remove(id: number) {
    return this.printDocumentRepository.delete(id);
  }
}
