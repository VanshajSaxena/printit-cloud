import { Test, TestingModule } from '@nestjs/testing';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

describe('VendorController', () => {
  let controller: VendorController;
  let service: VendorService;

  const mockVendorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findOneByUsername: jest.fn(),
    findOneBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorController],
      providers: [
        {
          provide: VendorService,
          useValue: mockVendorService,
        },
      ],
    }).compile();

    controller = module.get<VendorController>(VendorController);
    service = module.get<VendorService>(VendorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the create method of the service with the correct DTO', async () => {
      const createDto: CreateVendorDto = {
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@mail.com',
        username: 'harrypotter',
      };

      const expectedResult = { id: 1, ...createDto };
      mockVendorService.create.mockResolvedValue(expectedResult);

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
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@mail.com',
        },
      ];
      mockVendorService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call the findOne method of the service with the correct id', async () => {
      const id = '1';
      const expectedResult = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@mail.com',
      };
      mockVendorService.findOneById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOneById).toHaveBeenCalledWith(Number(id));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call the update method of the service with the correct id and DTO', async () => {
      const id = 1;
      const updateDto = {
        firstName: 'Ronn',
        lastName: 'Potter',
      };
      const expectedResult = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@mail.com',
      };
      mockVendorService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call the remove method of the service with the correct id', async () => {
      const id = 1;
      mockVendorService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
