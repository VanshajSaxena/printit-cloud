import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import { JobService } from 'src/job/job.service';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { VendorService } from 'src/vendor/vendor.service';
import {
  DataSource,
  EntityNotFoundError,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { FindTransactionResponseDto } from './dto/find-transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './enums/transaction-status.enum';
import { TransactionStatusResponseDto } from './dto/transaction-status-response.dto';

@Injectable()
export class TransactionService {
  private readonly generateShort = customAlphabet(
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    8,
  );
  private readonly generateLong = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyz',
    16,
  );

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly vendorService: VendorService,
    private readonly logger: ApplicationLogger,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly jobService: JobService,
  ) {
    this.logger.setContext(TransactionService.name);
  }

  private generateFriendlyId(): string {
    return `${this.generateShort()}-${this.generateLong()}`;
  }

  async create(createTransactionDto: CreateTransactionRequestDto) {
    const vendor = await this.vendorService.getEntityOne(
      createTransactionDto.vendorId,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const jobs = await this.jobService.createMany(
        createTransactionDto.jobs,
        queryRunner.manager,
      );

      if (createTransactionDto.jobs.length !== jobs.length) {
        throw new Error('JOB_COUNT_MISMATCH');
      }

      const newTransaction = queryRunner.manager.create(Transaction, {
        vendor,
        jobs,
        friendlyId: this.generateFriendlyId(),
      });

      const saved = await queryRunner.manager.save(newTransaction);
      await queryRunner.commitTransaction();
      this.notificationsGateway.sendNewTransactionToVendor(vendor.id, {
        id: saved.id,
      });
      return plainToInstance(CreateTransactionResponseDto, {
        ...saved,
        vendorId: saved.vendor.id,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if ((error as Error).message === 'JOB_COUNT_MISMATCH') {
        this.logger.error('Job count mismatch', createTransactionDto.jobs);
        throw new NotFoundException(
          'One or more print documents were not found.',
        );
      }
      this.logger.error('Transaction creation failed', (error as Error).stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(status?: TransactionStatus) {
    const transactions = await this.transactionRepository.find({
      relations: { jobs: { document: true } },
      where: { status: status },
    });
    return plainToInstance(FindTransactionResponseDto, transactions);
  }

  async findOne(id: number) {
    const transaction = await this.findOneEntity(id, {
      relations: { jobs: { document: true } },
    });
    return plainToInstance(FindTransactionResponseDto, transaction);
  }

  async findTransactionStatus(id: number) {
    const transactionStatus = await this.findOneEntity(id, {
      select: { status: true },
    });
    return plainToInstance(TransactionStatusResponseDto, transactionStatus);
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
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Transaction not found for id: ${id}`);
      }
      throw error;
    }
  }
}
