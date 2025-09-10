import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { In, Repository } from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { PrintDocument } from 'src/print-document/entities/print-document.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class PrintTransactionService {
  constructor(
    @InjectRepository(PrintTransaction)
    private printTransactionRepository: Repository<PrintTransaction>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(PrintDocument)
    private printDocumentRepository: Repository<PrintDocument>,
  ) {}

  async create(createPrintTransactionDto: CreatePrintTransactionDto) {
    const [vendor, printer, printDocuments] = await Promise.all([
      this.vendorRepository.findOneBy({
        id: createPrintTransactionDto.vendorId,
      }),
      this.printerRepository.findOneBy({
        id: createPrintTransactionDto.printerId,
      }),
      this.printDocumentRepository.findBy({
        id: In(createPrintTransactionDto.printDocumentIds),
      }),
    ]);

    if (!vendor) {
      throw new NotFoundException(
        `The vendor with id ${createPrintTransactionDto.vendorId} was not found.`,
      );
    }
    if (!printer) {
      throw new NotFoundException(
        `The printer with id ${createPrintTransactionDto.printerId} was not found.`,
      );
    }
    if (
      createPrintTransactionDto.printDocumentIds.length !==
      printDocuments.length
    ) {
      throw new NotFoundException(
        `One or more print documents were not found.`,
      );
    }

    const nanoid = customAlphabet('ABCDEFGHJKLMNOPQRSTUVWXYZ23456789', 8);
    let friendlyId: string;
    do {
      friendlyId = nanoid();
    } while (await this.printTransactionRepository.existsBy({ friendlyId }));

    const newPrintTransaction = this.printTransactionRepository.create({
      vendor,
      printer,
      printDocuments,
      friendlyId,
    });

    return this.printTransactionRepository.save(newPrintTransaction);
  }

  findAll() {
    return this.printTransactionRepository.find();
  }

  findOne(id: number) {
    return this.printTransactionRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatePrintTransactionDto: UpdatePrintTransactionDto,
  ) {
    const printTransaction = await this.printTransactionRepository.findOneBy({
      id,
    });
    if (!printTransaction) {
      throw new NotFoundException(
        `PrintTransaction not found for the id: ${id}`,
      );
    }
    Object.assign(printTransaction, updatePrintTransactionDto);
    return this.printTransactionRepository.save(printTransaction);
  }

  remove(id: number) {
    return this.printTransactionRepository.delete(id);
  }
}
