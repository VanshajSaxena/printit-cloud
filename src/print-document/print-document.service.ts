import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrintDocumentDto } from './dto/create-print-document.dto';
import { UpdatePrintDocumentDto } from './dto/update-print-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintDocument } from './entities/print-document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrintDocumentService {
  constructor(
    @InjectRepository(PrintDocument)
    private printDocumentRepository: Repository<PrintDocument>,
  ) {}

  create(createPrintDocumentDto: CreatePrintDocumentDto) {
    const newPrintDocument = this.printDocumentRepository.create(
      createPrintDocumentDto,
    );
    newPrintDocument.status = 'PENDING';
    return this.printDocumentRepository.save(newPrintDocument);
  }

  findAll() {
    return this.printDocumentRepository.find();
  }

  findOne(id: number) {
    return this.printDocumentRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePrintDocumentDto: UpdatePrintDocumentDto,
  ): Promise<PrintDocument> {
    const printDocument = await this.printDocumentRepository.findOneBy({ id });
    if (!printDocument) {
      throw new NotFoundException(`PrintDocument not found for the id: ${id}`);
    }
    Object.assign(printDocument, updatePrintDocumentDto);
    return this.printDocumentRepository.save(printDocument);
  }

  remove(id: number) {
    return this.printDocumentRepository.delete(id);
  }
}
