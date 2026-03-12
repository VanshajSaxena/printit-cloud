import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentService } from './document.service';
import { CreateDocumentBatchRequestDto } from './dto/create-document-batch-request.dto';
import { Document } from './entities/document.entity';

describe('DocumentService', () => {
  let service: DocumentService;
  let repository: Repository<Document>;

  const mockDocumentRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repository = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new print document', async () => {
      const createDto: CreateDocumentBatchRequestDto = {
        documents: [
          {
            filename: 'Test Document',
            contentType: 'application/pdf',
            draftId: 'abc',
          },
        ],
      };

      const createdDocument = {
        ...createDto,
      };

      const savedDocument = {
        id: 1,
        ...createdDocument,
      };

      mockDocumentRepository.create.mockReturnValue(createdDocument);
      mockDocumentRepository.save.mockResolvedValue(savedDocument);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdDocument);
      expect(result).toEqual(savedDocument);
    });
  });
});
