import { Test, TestingModule } from '@nestjs/testing';
import { CreateJobDto } from 'src/job/dto/create-job.dto';
import { OutputColor } from 'src/job/enums/job.enum';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the service with the correct DTO', async () => {
      const createDto: CreateTransactionRequestDto = {
        vendorId: 1,
        jobs: [
          new CreateJobDto({
            documentId: 1,
            copyCount: 2,
            outputColor: OutputColor.COLOR,
          }),
        ],
      };

      const expectedResult = { id: 1, ...createDto };
      mockTransactionService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the service with correct DTO', async () => {
      const expectedResult = [{ id: 1, vendorId: 1, documentIds: [1, 2] }];

      mockTransactionService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service with correct DTO', async () => {
      const id = 1;
      const expectedResult = { id: 1, vendorId: 1, documentIds: [1, 2] };

      mockTransactionService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the update method of the service with correct DTO', async () => {
      const id = 1;
      const updataDto: UpdateTransactionDto = { printerId: 1 };
      const expectedResult = {
        id: 1,
        vendorId: 1,
        documentIds: [1, 2],
        printerId: 1,
      };

      mockTransactionService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updataDto);

      expect(service.update).toHaveBeenCalledWith(id, updataDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service with correct DTO', async () => {
      const id = 1;
      mockTransactionService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
