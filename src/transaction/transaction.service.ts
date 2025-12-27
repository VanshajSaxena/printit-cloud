import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { VendorService } from 'src/vendor/vendor.service';
import { PrinterService } from 'src/printer/printer.service';
import { JobService } from 'src/job/job.service';
import { FindTransactionResponseDto } from './dto/find-transaction-response.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private vendorService: VendorService,
    private printerService: PrinterService,
    private logger: ApplicationLogger,
    private jobService: JobService,
  ) {
    this.logger.setContext(TransactionService.name);
  }

  private charSet: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  async create(createTransactionDto: CreateTransactionRequestDto) {
    const vendor = await this.vendorService.getEntityOne(
      createTransactionDto.vendorId,
    );

    const jobs = await this.jobService.createMany(createTransactionDto.jobs);

    if (createTransactionDto.jobs.length !== jobs.length) {
      this.logger.error(
        'Created Job count do not match with dto job count.',
        createTransactionDto.jobs,
        createTransactionDto.jobs.length,
      );
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
      jobs,
      friendlyId,
    });

    const saved = await this.transactionRepository.save(newTransaction);
    return plainToInstance(CreateTransactionResponseDto, saved);
  }

  async findAll() {
    const transactions = await this.transactionRepository.find();
    return plainToInstance(CreateTransactionResponseDto, transactions);
  }

  async findOne(id: number) {
    const transaction = await this.findOneEntity(id, {
      relations: { jobs: { document: true } },
    });
    return plainToInstance(FindTransactionResponseDto, transaction);
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOneEntity(id);
    Object.assign(transaction, updateTransactionDto);
    const saved = await this.transactionRepository.save(transaction);
    return plainToInstance(CreateTransactionResponseDto, saved);
  }

  async remove(id: number) {
    const transaction = await this.findOneEntity(id);
    const removed = await this.transactionRepository.softRemove(transaction);
    return plainToInstance(CreateTransactionResponseDto, removed);
  }

  private async findOneEntity(
    id: number,
    options?: FindOneOptions<Transaction>,
  ) {
    try {
      return await this.transactionRepository.findOneOrFail({
        where: { id },
        ...options,
      });
    } catch {
      throw new NotFoundException(`Transaction not found for id: ${id}`);
    }
  }
}
