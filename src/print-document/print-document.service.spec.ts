import { Test, TestingModule } from '@nestjs/testing';
import { PrintDocumentService } from './print-document.service';
import { Repository } from 'typeorm';
import { PrintDocument } from './entities/print-document.entity';
import { DocumentStatus } from './enums/document-status.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePrintDocumentDto } from './dto/create-print-document.dto';

describe('PrintDocumentService', () => {
  let service: PrintDocumentService;
  let repository: Repository<PrintDocument>;

  const mockPrintDocumentRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrintDocumentService,
        {
          provide: getRepositoryToken(PrintDocument),
          useValue: mockPrintDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<PrintDocumentService>(PrintDocumentService);
    repository = module.get<Repository<PrintDocument>>(
      getRepositoryToken(PrintDocument),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new print document and save it with PENDING status', async () => {
      const createDto: CreatePrintDocumentDto = {
        name: 'Test Document',
        path: 'test/path.pdf',
        configuration: '{"pages": 1}',
      };

      const createdDocument = {
        ...createDto,
        status: DocumentStatus.PENDING,
      };

      const savedDocument = {
        id: 1,
        ...createdDocument,
      };

      mockPrintDocumentRepository.create.mockReturnValue(createdDocument);
      mockPrintDocumentRepository.save.mockResolvedValue(savedDocument);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdDocument);
      expect(result).toEqual(savedDocument);
    });
  });
});
