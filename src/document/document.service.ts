import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { UploadFileBatchRequestDto } from 'src/r2/dto/upload-file-batch-request.dto';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { CreateDocumentBatchRequestDto } from './dto/create-document-batch-request.dto';
import { CreateDocumentBatchResponseDto } from './dto/create-document-batch-response.dto';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { CreateDocumentResponseDto } from './dto/create-document-response.dto';
import { UpdateDocumentRequestDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(DocumentService.name);
  }

  async create(createDocumentDto: CreateDocumentBatchRequestDto) {
    const draftIdMap = new Map<string, string>();
    const newDocuments = createDocumentDto.documents.map((document) => {
      const documentkey = this.getDocumentKey(document);
      const newDocument = this.documentRepository.create(document);
      newDocument.key = documentkey;
      draftIdMap.set(newDocument.key, document.draftId);
      return newDocument;
    });
    const saved = await this.documentRepository.save(newDocuments);
    const documents = saved.map((savedDocument) => {
      const draftId = draftIdMap.get(savedDocument.key);
      if (!draftId) {
        this.logger.error(
          'Document creation failed due to in-memory mapping failure',
        );
        throw new InternalServerErrorException(
          `Mapping failed for key: ${savedDocument.key}`,
        );
      }
      return new CreateDocumentResponseDto({ ...savedDocument, draftId });
    });
    return new CreateDocumentBatchResponseDto({ documents });
  }

  async findManyByIds(ids: number[]) {
    if (!ids.length) return [];
    return this.documentRepository.find({
      where: {
        id: In(ids),
      },
    });
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

  async update(id: number, updateDocumentDto: UpdateDocumentRequestDto) {
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

  getEntitites(ids: number[], options?: FindManyOptions<Document>) {
    return this.documentRepository.find({ where: { id: In(ids) }, ...options });
  }

  getEntityOne(id: number) {
    return this.findOneEntity(id);
  }

  private async findOneEntity(id: number, options?: FindOneOptions<Document>) {
    try {
      return await this.documentRepository.findOneOrFail({
        where: { id },
        ...options,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Document not found for the id: ${id}`);
      }
      throw error;
    }
  }

  private getDocumentKey(document: CreateDocumentRequestDto) {
    // NOTE: it should be using nanoid for uniqueness in key names
    return document.filename
      .trim()
      .toLowerCase()
      .normalize()
      .replaceAll(' ', '-')
      .replaceAll('/', '-');
  }

  /**
   * This is only partially guarantees creation order thus is not reliable for
   * creating documents in bulk.
   */
  async createMany(createDocumentDto: CreateDocumentRequestDto[]) {
    const newDocument = this.documentRepository.create(createDocumentDto);
    const saved = await this.documentRepository.save(newDocument);
    this.logger.log('Created multiple document objects', [saved.length, saved]);
    return plainToInstance(CreateDocumentResponseDto, saved);
  }
}
