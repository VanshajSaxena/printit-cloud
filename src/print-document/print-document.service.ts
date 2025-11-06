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
    const printDocuments = await this.printDocumentRepository.find();
    return plainToInstance(PrintDocumentResponseDto, printDocuments);
  }

  async findOne(id: number) {
    const printDocument = await this.findOneEntity(id);
    return plainToInstance(PrintDocumentResponseDto, printDocument);
  }

  async update(id: number, updatePrintDocumentDto: UpdatePrintDocumentDto) {
    const printDocument = await this.findOneEntity(id);
    Object.assign(printDocument, updatePrintDocumentDto);
    const saved = await this.printDocumentRepository.save(printDocument);
    return plainToInstance(PrintDocumentResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed =
      await this.printDocumentRepository.softRemove(entityNeedRemoval);
    return plainToInstance(PrintDocumentResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const printDocument = await this.printDocumentRepository.findOneBy({ id });
    if (!printDocument) {
      throw new NotFoundException(`PrintDocument not found for the id: ${id}`);
    }
    return printDocument;
  }
}
