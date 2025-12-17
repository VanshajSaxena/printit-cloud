import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { In, Repository } from 'typeorm';
import { DocumentStatus } from './enums/document-status.enum';
import { plainToInstance } from 'class-transformer';
import { DocumentResponseDto } from './dto/document-response.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const newDocument = this.documentRepository.create(createDocumentDto);
    newDocument.status = DocumentStatus.PENDING;
    const saved = await this.documentRepository.save(newDocument);
    return plainToInstance(DocumentResponseDto, saved);
  }

  async findAll() {
    const documents = await this.documentRepository.find();
    return plainToInstance(DocumentResponseDto, documents);
  }

  async findOne(id: number) {
    const document = await this.findOneEntity(id);
    return plainToInstance(DocumentResponseDto, document);
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOneEntity(id);
    Object.assign(document, updateDocumentDto);
    const saved = await this.documentRepository.save(document);
    return plainToInstance(DocumentResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.documentRepository.softRemove(entityNeedRemoval);
    return plainToInstance(DocumentResponseDto, removed);
  }

  getEntitites(ids: number[]) {
    return this.documentRepository.findBy({ id: In(ids) });
  }

  getEntityOne(id: number) {
    return this.findOneEntity(id);
  }

  private async findOneEntity(id: number) {
    const document = await this.documentRepository.findOneBy({ id });
    if (!document) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return document;
  }
}
