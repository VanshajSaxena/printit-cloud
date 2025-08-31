import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { In, Repository } from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { PrintDocument } from 'src/print-document/entities/print-document.entity';

@Injectable()
export class PrintTransactionService {
  constructor(
    @InjectRepository(PrintTransaction)
    private printTransactionRepository: Repository<PrintTransaction>,
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    @InjectRepository(Printer) private printerRepository: Repository<Printer>,
    @InjectRepository(PrintDocument)
    private printDocumentRepository: Repository<PrintDocument>,
  ) {}

  async create(createPrintTransactionDto: CreatePrintTransactionDto) {
    if (
      createPrintTransactionDto.vendorId === undefined ||
      createPrintTransactionDto.vendorId === null
    ) {
      throw new BadRequestException('Vendor ID is required.');
    }
    const vendor = await this.vendorRepository.findOneBy({
      id: createPrintTransactionDto.vendorId,
    });

    if (!vendor) {
      throw new NotFoundException(
        `The vendor with id ${createPrintTransactionDto.vendorId} was not found.`,
      );
    }

    const printer = await this.printerRepository.findOneBy({
      id: createPrintTransactionDto.printerId,
    });
    const printDocuments = await this.printDocumentRepository.findBy({
      id: In(createPrintTransactionDto.printDocumentIds),
    });
    if (
      createPrintTransactionDto.printDocumentIds.length !==
      printDocuments.length
    ) {
      throw new NotFoundException(
        `One or more print documents were not found.`,
      );
    }
    const newPrintTransaction = new PrintTransaction();
    newPrintTransaction.vendor = vendor;
    newPrintTransaction.printer = printer;
    newPrintTransaction.printDocuments = printDocuments;

    return this.printTransactionRepository.save(newPrintTransaction);
  }

  findAll() {
    return this.printTransactionRepository.find();
  }

  findOne(id: number) {
    return this.printTransactionRepository.findOneBy({ id });
  }

  update(id: number, updatePrintTransactionDto: UpdatePrintTransactionDto) {
    // return this.printTransactionRepository.update(
    //   id,
    //   updatePrintTransactionDto,
    // );
  }

  remove(id: number) {
    return this.printTransactionRepository.delete(id);
  }
}
