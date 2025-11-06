import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { Repository } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { plainToInstance } from 'class-transformer';
import { PrintTransactionResponseDto } from './dto/print-transaction-response.dto';
import { VendorService } from 'src/vendor/vendor.service';
import { PrintDocumentService } from 'src/print-document/print-document.service';
import { PrinterService } from 'src/printer/printer.service';

@Injectable()
export class PrintTransactionService {
  constructor(
    @InjectRepository(PrintTransaction)
    private printTransactionRepository: Repository<PrintTransaction>,
    private vendorService: VendorService,
    private printerService: PrinterService,
    private printDocumentService: PrintDocumentService,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(PrintTransactionService.name);
  }

  private charSet: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  async create(createPrintTransactionDto: CreatePrintTransactionDto) {
    const vendor = await this.vendorService.getEntityOne(
      createPrintTransactionDto.vendorId,
    );

    const printDocuments = await this.printDocumentService.getEntitites(
      createPrintTransactionDto.printDocumentIds,
    );

    if (
      createPrintTransactionDto.printDocumentIds.length !==
      printDocuments.length
    ) {
      throw new NotFoundException(
        `One or more print documents were not found.`,
      );
    }

    let printer = null;
    if (createPrintTransactionDto.printerId) {
      printer = await this.printerService.getOptionalEntityOne(
        createPrintTransactionDto.printerId,
      );
      if (!printer) {
        throw new NotFoundException(
          `The printer with id ${createPrintTransactionDto.printerId} was not found.`,
        );
      }
    }

    const nanoid = customAlphabet(this.charSet, 8);

    let friendlyId: string = nanoid();
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

    const saved =
      await this.printTransactionRepository.save(newPrintTransaction);
    return plainToInstance(PrintTransactionResponseDto, saved);
  }

  async findAll() {
    const printTransactions = await this.printTransactionRepository.find();
    return plainToInstance(PrintTransactionResponseDto, printTransactions);
  }

  async findOne(id: number) {
    const printTransaction = await this.findOneEntity(id);
    return plainToInstance(PrintTransactionResponseDto, printTransaction);
  }

  async update(
    id: number,
    updatePrintTransactionDto: UpdatePrintTransactionDto,
  ) {
    const printTransaction = await this.findOneEntity(id);
    Object.assign(printTransaction, updatePrintTransactionDto);
    const saved = await this.printTransactionRepository.save(printTransaction);
    return plainToInstance(PrintTransactionResponseDto, saved);
  }

  async remove(id: number) {
    const printTransaction = await this.findOneEntity(id);
    const removed =
      await this.printTransactionRepository.softRemove(printTransaction);
    return plainToInstance(PrintTransactionResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const printTransaction = await this.printTransactionRepository.findOneBy({
      id,
    });
    if (!printTransaction) {
      throw new NotFoundException(
        `PrintTransaction not found for the id: ${id}`,
      );
    }
    return printTransaction;
  }
}
