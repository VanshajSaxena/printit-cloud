import { Test, TestingModule } from '@nestjs/testing';
import { PrintDocumentController } from './print-document.controller';
import { PrintDocumentService } from './print-document.service';

describe('PrintDocumentController', () => {
  let controller: PrintDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintDocumentController],
      providers: [PrintDocumentService],
    }).compile();

    controller = module.get<PrintDocumentController>(PrintDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
