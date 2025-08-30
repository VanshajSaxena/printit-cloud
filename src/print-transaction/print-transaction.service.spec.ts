import { Test, TestingModule } from '@nestjs/testing';
import { PrintTransactionService } from './print-transaction.service';

describe('PrintTransactionService', () => {
  let service: PrintTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintTransactionService],
    }).compile();

    service = module.get<PrintTransactionService>(PrintTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
