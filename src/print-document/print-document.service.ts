import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-print-document.dto';
import { UpdateDocumentDto } from './dto/update-print-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/print-document.entity';
import { In, Repository } from 'typeorm';
import { DocumentStatus } from './enums/document-status.enum';
import { plainToInstance } from 'class-transformer';
import { DocumentResponseDto } from './dto/print-document-response.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private printDocumentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const newDocument = this.printDocumentRepository.create(
      createDocumentDto,
    );
    newDocument.status = DocumentStatus.PENDING;
    const saved = await this.printDocumentRepository.save(newDocument);
    return plainToInstance(DocumentResponseDto, saved);
  }

  async findAll() {
    const printDocuments = await this.printDocumentRepository.find();
    return plainToInstance(DocumentResponseDto, printDocuments);
  }

  async findOne(id: number) {
    const printDocument = await this.findOneEntity(id);
    return plainToInstance(DocumentResponseDto, printDocument);
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const printDocument = await this.findOneEntity(id);
    Object.assign(printDocument, updateDocumentDto);
    const saved = await this.printDocumentRepository.save(printDocument);
    return plainToInstance(DocumentResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed =
      await this.printDocumentRepository.softRemove(entityNeedRemoval);
    return plainToInstance(DocumentResponseDto, removed);
  }

  getEntitites(ids: number[]) {
    return this.printDocumentRepository.findBy({ id: In(ids) });
  }

  getEntityOne(id: number) {
    return this.findOneEntity(id);
  }

  private async findOneEntity(id: number) {
    const printDocument = await this.printDocumentRepository.findOneBy({ id });
    if (!printDocument) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return printDocument;
  }
}
