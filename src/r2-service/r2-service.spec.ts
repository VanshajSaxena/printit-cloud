import { Test, TestingModule } from '@nestjs/testing';
import { R2Service } from './r2-service';

describe('R2Service', () => {
  let provider: R2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [R2Service],
    }).compile();

    provider = module.get<R2Service>(R2Service);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
