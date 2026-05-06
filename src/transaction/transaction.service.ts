import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import { StatusEnum } from 'src/common/types/status-enum';
import { JobService } from 'src/job/job.service';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { VendorService } from 'src/vendor/vendor.service';
import {
  DataSource,
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { FindTransactionResponseDto } from './dto/find-transaction-response.dto';
import { TransactionStatusResponseDto } from './dto/transaction-status-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionResultRow } from './types/update-transaction-result-row';
import { RequestUser } from 'src/decorators/public.decorator';

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
      this.notificationsGateway.emitNewTransactionToVendor(vendor.id, {
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

  async findAll(
    user: RequestUser,
    statuses?: StatusEnum[],
    page = 1,
    pageSize = 10,
  ) {
    const safePage = page;
    const safePageSize = pageSize;
    const where: FindOptionsWhere<Transaction> = {
      vendor: { id: user.sub },
    };
    if (statuses?.length) {
      where.status = In(statuses);
    }
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        relations: { jobs: { document: true } },
        where,
        take: safePageSize,
        skip: (safePage - 1) * safePageSize,
        order: { createdAt: 'DESC' },
      },
    );
    return {
      data: plainToInstance(FindTransactionResponseDto, transactions),
      meta: {
        page: safePage,
        pageSize: safePageSize,
        total,
        totalPages: Math.ceil(total / safePageSize),
      },
    };
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

  async updateTransactionAndJobsStatus(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<void> {
    const { status, reason } = updateTransactionDto;

    const rows = await this.dataSource.query<
      (UpdateTransactionResultRow | undefined)[]
    >(
      `
      WITH updated_transaction AS (
        UPDATE transactions
        SET status = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, vendor_id
      ),
      updated_jobs AS (
        UPDATE jobs
        SET status = $2,
            updated_at = NOW()
        WHERE transaction_id = $1
      ),
      inserted_history AS (
        INSERT INTO transaction_status_history (transaction_id, status, reason, "created_at")
        SELECT id, $2, $3, NOW()
        FROM updated_transaction
      )
      SELECT id, vendor_id FROM updated_transaction;
      `,
      [id, status, reason ?? null],
    );

    const row = rows[0];

    if (!row) {
      throw new NotFoundException(`Transaction not found for id: ${id}`);
    }

    if (status === StatusEnum.COMPLETED) {
      this.notificationsGateway.emitTransactionCompleted({
        transactionId: row.id,
        vendorId: row.vendor_id,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    // PERF: Later this method event should be emitted in a dedicated endpoint like PATCH transactions/:id/status
    const transaction = await this.findOneEntity(id, {
      relations: { vendor: true },
    });
    Object.assign(transaction, updateTransactionDto);
    const saved = await this.transactionRepository.save(transaction);
    this.notificationsGateway.emitTransactionCompleted({
      transactionId: transaction.id,
      vendorId: transaction.vendor.id,
      timestamp: new Date().toISOString(),
    });
    return plainToInstance(CreateTransactionResponseDto, saved);
  }

  async remove(id: number) {
    const transaction = await this.findOneEntity(id);
    const removed = await this.transactionRepository.softRemove(transaction);
    return plainToInstance(CreateTransactionResponseDto, removed);
  }

  async findOneEntity(id: number, options?: FindOneOptions<Transaction>) {
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
