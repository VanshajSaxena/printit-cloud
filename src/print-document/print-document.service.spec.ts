import { Test, TestingModule } from '@nestjs/testing';
import { PrintDocumentService } from './print-document.service';

describe('PrintDocumentService', () => {
  let service: PrintDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrintDocumentService],
    }).compile();

    service = module.get<PrintDocumentService>(PrintDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
