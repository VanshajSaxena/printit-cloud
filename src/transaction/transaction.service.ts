import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { customAlphabet } from 'nanoid';
import { JobService } from 'src/job/job.service';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { VendorService } from 'src/vendor/vendor.service';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { FindTransactionResponseDto } from './dto/find-transaction-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './enums/transaction-status.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly vendorService: VendorService,
    private readonly logger: ApplicationLogger,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly jobService: JobService,
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

    const nanoid = customAlphabet(this.charSet, 8);

    let friendlyId: string = nanoid();
    while (await this.transactionRepository.existsBy({ friendlyId })) {
      friendlyId = nanoid();
      this.logger.warn('An existing nanoid was generated.');
    }

    const newTransaction = this.transactionRepository.create({
      vendor,
      jobs,
      friendlyId,
    });

    const saved = await this.transactionRepository.save(newTransaction);
    this.notificationsGateway.sendNewTransactionToVendor(vendor.id, {
      id: saved.id,
    });
    return plainToInstance(CreateTransactionResponseDto, saved);
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
