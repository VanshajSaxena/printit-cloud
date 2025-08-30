import { Injectable } from '@nestjs/common';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrintTransactionService {
  constructor(
    @InjectRepository(PrintTransaction)
    private printTransactionRepository: Repository<PrintTransaction>,
  ) {}

  create(createPrintTransactionDto: CreatePrintTransactionDto) {
    return this.printTransactionRepository.create(createPrintTransactionDto);
  }

  findAll() {
    return this.printTransactionRepository.find();
  }

  findOne(id: number) {
    return this.printTransactionRepository.findOneBy({ id });
  }

  update(id: number, updatePrintTransactionDto: UpdatePrintTransactionDto) {
    return this.printTransactionRepository.update(
      id,
      updatePrintTransactionDto,
    );
  }

  remove(id: number) {
    return this.printTransactionRepository.delete(id);
  }
}
