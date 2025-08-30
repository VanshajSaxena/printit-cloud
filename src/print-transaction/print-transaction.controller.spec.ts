import { Test, TestingModule } from '@nestjs/testing';
import { PrintTransactionController } from './print-transaction.controller';
import { PrintTransactionService } from './print-transaction.service';

describe('PrintTransactionController', () => {
  let controller: PrintTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintTransactionController],
      providers: [PrintTransactionService],
    }).compile();

    controller = module.get<PrintTransactionController>(
      PrintTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
