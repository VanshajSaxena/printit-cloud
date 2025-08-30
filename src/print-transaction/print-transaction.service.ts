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
    const newPrintTransaction = this.printTransactionRepository.create(
      createPrintTransactionDto,
    );
    return this.printTransactionRepository.save(newPrintTransaction);
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
