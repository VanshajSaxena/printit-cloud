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
import { ApplicationLogger } from 'src/logger/application-logger.service';

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
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(PrintTransactionService.name);
  }

  private charSet: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  async create(createPrintTransactionDto: CreatePrintTransactionDto) {
    const vendor = await this.vendorRepository.findOneBy({
      id: createPrintTransactionDto.vendorId,
    });

    if (!vendor) {
      throw new NotFoundException(
        `The vendor with id ${createPrintTransactionDto.vendorId} was not found.`,
      );
    }

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

    // no check for printer as it is nullable
    const printer = await this.printerRepository.findOneBy({
      id: createPrintTransactionDto.printerId,
    });

    const nanoid = customAlphabet(this.charSet, 8);

    let friendlyId: string = nanoid(); // NOTE: Can be imporved with set retries.
    while (await this.printTransactionRepository.existsBy({ friendlyId })) {
      friendlyId = nanoid();
      this.logger.warn('An existing nanoid was generated.');
    }

    const newPrintTransaction = this.printTransactionRepository.create({
      vendor,
      printer,
      printDocuments,
      friendlyId,
    });

    return this.printTransactionRepository.save(newPrintTransaction);
  }

  async findAll() {
    return this.printTransactionRepository.find();
  }

  async findOne(id: number) {
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
    // NOTE: Use update method here and check for affected rows to provide feedback.
    Object.assign(printTransaction, updatePrintTransactionDto);
    return this.printTransactionRepository.save(printTransaction);
  }

  async remove(id: number) {
    return this.printTransactionRepository.delete(id);
  }
}
