import { Test, TestingModule } from '@nestjs/testing';
import { AnonUserService } from './anon-user.service';

describe('AnonUserService', () => {
  let service: AnonUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnonUserService],
    }).compile();

    service = module.get<AnonUserService>(AnonUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
