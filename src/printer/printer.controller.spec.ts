import { Test, TestingModule } from '@nestjs/testing';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';

describe('PrinterController', () => {
  let controller: PrinterController;
  let service: PrinterService;

  const mockPrinterService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrinterController],
      providers: [
        {
          provide: PrinterService,
          useValue: mockPrinterService,
        },
      ],
    }).compile();

    controller = module.get<PrinterController>(PrinterController);
    service = module.get<PrinterService>(PrinterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('crate', () => {
    it('should call the create method of the service with the correct DTO', async () => {
      const createDto = {
        name: 'HP LaserJet 5581',
        capabilities: '{ "ColorMode" : "Color" }',
        vendorId: 1,
      };

      const expectedResult = { id: 1, ...CreatePrinterDto };
      mockPrinterService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call the findAll method of the service', async () => {
      const expectedResult = [
        {
          id: 1,
          name: 'HP LaserJet 5581',
          capabilities: '{ "ColorMode" : "Color" }',
        },
      ];

      mockPrinterService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service with the correct id', async () => {
      const id = 1;
      const expectedResult = {
        id: 1,
        name: 'HP LaserJet 5581',
        capabilities: '{ "ColorMode" : "Color" }',
      };

      mockPrinterService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the update method of the service with the correct id and DTO', async () => {
      const id = 1;
      const updateDto: UpdatePrinterDto = { name: 'HP InkJet 5115' };
      const expectedResult = [
        {
          id: 1,
          name: 'HP InkJet 5115',
          capabilities: '{ "ColorMode" : "Color" }',
        },
      ];

      mockPrinterService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service with the correct id', async () => {
      const id = 1;
      mockPrinterService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
