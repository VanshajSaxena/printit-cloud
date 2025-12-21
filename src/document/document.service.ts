import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { UploadFileBatchRequestDto } from 'src/r2/dto/upload-file-batch-request.dto';
import { In, Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document-request.dto';
import { CreateDocumentResponseDto } from './dto/create-document-response.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  private readonly env: string;
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private logger: ApplicationLogger,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(DocumentService.name);
    this.env = this.config.getOrThrow('NODE_ENV');
  }

  async create(createDocumentDto: CreateDocumentDto) {
    const cleanedFilename = createDocumentDto.filename
      .trim()
      .toLowerCase()
      .normalize()
      .replaceAll(' ', '-')
      .replaceAll('/', '-');
    const keyArr = [this.env, cleanedFilename];
    const key = keyArr.join('/');
    const newDocument = this.documentRepository.create(createDocumentDto);
    newDocument.key = key;
    const saved = await this.documentRepository.save(newDocument);
    this.logger.log('Created a new document object', [saved]);
    return plainToInstance(CreateDocumentResponseDto, saved);
  }

  async findByIds({ ids }: UploadFileBatchRequestDto) {
    const documents = await this.documentRepository.findBy({ id: In(ids) });
    return documents.map(({ filename, contentType, key, id }) => {
      return { filename, contentType, key, id };
    });
  }

  async findAll() {
    const documents = await this.documentRepository.find();
    return plainToInstance(CreateDocumentResponseDto, documents);
  }

  async findOne(id: number) {
    const document = await this.findOneEntity(id);
    return plainToInstance(CreateDocumentResponseDto, document);
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOneEntity(id);
    Object.assign(document, updateDocumentDto);
    const saved = await this.documentRepository.save(document);
    return plainToInstance(CreateDocumentResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.documentRepository.softRemove(entityNeedRemoval);
    return plainToInstance(CreateDocumentResponseDto, removed);
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

  /**
   * This is only partially guarantees creation order thus is not reliable for
   * creating documents in bulk.
   */
  async createMany(createDocumentDto: CreateDocumentDto[]) {
    const newDocument = this.documentRepository.create(createDocumentDto);
    const saved = await this.documentRepository.save(newDocument);
    this.logger.log('Created multiple document objects', [saved.length, saved]);
    return plainToInstance(CreateDocumentResponseDto, saved);
  }
}
