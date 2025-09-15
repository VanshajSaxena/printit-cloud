import { Test, TestingModule } from '@nestjs/testing';
import { PrintDocumentController } from './print-document.controller';
import { PrintDocumentService } from './print-document.service';
import { CreatePrintDocumentDto } from './dto/create-print-document.dto';
import { UpdatePrintDocumentDto } from './dto/update-print-document.dto';

describe('PrintDocumentController', () => {
  let controller: PrintDocumentController;
  let service: PrintDocumentService;

  const mockPrintDocumentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintDocumentController],
      providers: [
        {
          provide: PrintDocumentService,
          useValue: mockPrintDocumentService,
        },
      ],
    }).compile();

    controller = module.get<PrintDocumentController>(PrintDocumentController);
    service = module.get<PrintDocumentService>(PrintDocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the service with the correct DTO', async () => {
      const createDto: CreatePrintDocumentDto = {
        name: 'Test Doc',
        path: '/path/to/doc',
      };

      const expectedResult = { id: 1, ...createDto };
      mockPrintDocumentService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the service', async () => {
      const expectedResult = [
        { id: 1, name: 'Test Doc', path: '/path/to/doc' },
      ];
      mockPrintDocumentService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service with the correct id', async () => {
      const id = 1;
      const expectedResult = { id: 1, name: 'Test Doc', path: '/path/to/doc' };
      mockPrintDocumentService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the update method of the service with the correct id and DTO', async () => {
      const id = 1;
      const updateDto: UpdatePrintDocumentDto = { name: 'Updated Doc' };
      const expectedResult = {
        id: 1,
        name: 'Updated Doc',
        path: '/path/to/doc',
      };
      mockPrintDocumentService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service with the correct id', async () => {
      const id = 1;
      mockPrintDocumentService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
