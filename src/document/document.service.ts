import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { ApplicationLogger } from 'src/logger/application-logger.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(DocumentService.name);
  }

  async createMany(createDocumentDto: CreateDocumentDto[]) {
    const newDocument = this.documentRepository.create(createDocumentDto);
    const saved = await this.documentRepository.save(newDocument);
    this.logger.log('Created multiple document objects', [saved.length, saved]);
    return plainToInstance(DocumentResponseDto, saved);
  }

  async create(createDocumentDto: CreateDocumentDto) {
    const newDocument = this.documentRepository.create(createDocumentDto);
    const saved = await this.documentRepository.save(newDocument);
    this.logger.log('Created a new document object', saved);
    return plainToInstance(DocumentResponseDto, [saved]);
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
