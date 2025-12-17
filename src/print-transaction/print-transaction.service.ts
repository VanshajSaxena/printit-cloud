import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-print-transaction.dto';
import { UpdateTransactionDto } from './dto/update-print-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/print-transaction.entity';
import { Repository } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { plainToInstance } from 'class-transformer';
import { TransactionResponseDto } from './dto/print-transaction-response.dto';
import { VendorService } from 'src/vendor/vendor.service';
import { DocumentService } from 'src/document/document.service';
import { PrinterService } from 'src/printer/printer.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private vendorService: VendorService,
    private printerService: PrinterService,
    private documentService: DocumentService,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(TransactionService.name);
  }

  private charSet: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  async create(createTransactionDto: CreateTransactionDto) {
    const vendor = await this.vendorService.getEntityOne(
      createTransactionDto.vendorId,
    );

    const documents = await this.documentService.getEntitites(
      createTransactionDto.documentIds,
    );

    if (
      createTransactionDto.documentIds.length !==
      documents.length
    ) {
      throw new NotFoundException(
        `One or more print documents were not found.`,
      );
    }

    let printer = null;
    if (createTransactionDto.printerId) {
      printer = await this.printerService.getOptionalEntityOne(
        createTransactionDto.printerId,
      );
      if (!printer) {
        throw new NotFoundException(
          `The printer with id ${createTransactionDto.printerId} was not found.`,
        );
      }
    }

    const nanoid = customAlphabet(this.charSet, 8);

    let friendlyId: string = nanoid();
    while (await this.transactionRepository.existsBy({ friendlyId })) {
      friendlyId = nanoid();
      this.logger.warn('An existing nanoid was generated.');
    }

    const newTransaction = this.transactionRepository.create({
      vendor,
      printer,
      documents,
      friendlyId,
    });

    const saved =
      await this.transactionRepository.save(newTransaction);
    return plainToInstance(TransactionResponseDto, saved);
  }

  async findAll() {
    const transactions = await this.transactionRepository.find();
    return plainToInstance(TransactionResponseDto, transactions);
  }

  async findOne(id: number) {
    const transaction = await this.findOneEntity(id);
    return plainToInstance(TransactionResponseDto, transaction);
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.findOneEntity(id);
    Object.assign(transaction, updateTransactionDto);
    const saved = await this.transactionRepository.save(transaction);
    return plainToInstance(TransactionResponseDto, saved);
  }

  async remove(id: number) {
    const transaction = await this.findOneEntity(id);
    const removed =
      await this.transactionRepository.softRemove(transaction);
    return plainToInstance(TransactionResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const transaction = await this.transactionRepository.findOneBy({
      id,
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction not found for the id: ${id}`,
      );
    }
    return transaction;
  }
}
