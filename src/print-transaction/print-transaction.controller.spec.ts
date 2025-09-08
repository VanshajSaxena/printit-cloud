import { Test, TestingModule } from '@nestjs/testing';
import { PrintTransactionController } from './print-transaction.controller';
import { PrintTransactionService } from './print-transaction.service';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';

describe('PrintTransactionController', () => {
  let controller: PrintTransactionController;
  let service: PrintTransactionService;

  const mockPrintTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintTransactionController],
      providers: [
        {
          provide: PrintTransactionService,
          useValue: mockPrintTransactionService,
        },
      ],
    }).compile();

    controller = module.get<PrintTransactionController>(
      PrintTransactionController,
    );
    service = module.get<PrintTransactionService>(PrintTransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the service with the correct DTO', async () => {
      const createDto: CreatePrintTransactionDto = {
        vendorId: 1,
        printDocumentIds: [1, 2],
      };

      const expectedResult = { id: 1, ...createDto };
      mockPrintTransactionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the service with correct DTO', async () => {
      const expectedResult = [{ id: 1, vendorId: 1, printDocumentIds: [1, 2] }];

      mockPrintTransactionService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service with correct DTO', async () => {
      const id = '1';
      const expectedResult = { id: 1, vendorId: 1, printDocumentIds: [1, 2] };

      mockPrintTransactionService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(+id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the update method of the service with correct DTO', async () => {
      const id = '1';
      const updataDto: UpdatePrintTransactionDto = { printerId: 1 };
      const expectedResult = {
        id: 1,
        vendorId: 1,
        printDocumentIds: [1, 2],
        printerId: 1,
      };

      mockPrintTransactionService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updataDto);

      expect(service.update).toHaveBeenCalledWith(+id, updataDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service with correct DTO', async () => {
      const id = '1';
      mockPrintTransactionService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(+id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
