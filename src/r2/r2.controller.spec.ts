import { Test, TestingModule } from '@nestjs/testing';
import { R2Controller } from './r2.controller';
import { R2Service } from './r2.service';

describe('R2Controller', () => {
  let controller: R2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [R2Controller],
      providers: [R2Service],
    }).compile();

    controller = module.get<R2Controller>(R2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
