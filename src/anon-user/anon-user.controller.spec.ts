import { Test, TestingModule } from '@nestjs/testing';
import { AnonUserController } from './anon-user.controller';
import { AnonUserService } from './anon-user.service';

describe('AnonUserController', () => {
  let controller: AnonUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnonUserController],
      providers: [AnonUserService],
    }).compile();

    controller = module.get<AnonUserController>(AnonUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
