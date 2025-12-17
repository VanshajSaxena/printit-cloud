import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './print-transaction.service';
import { CreateTransactionDto } from './dto/create-print-transaction.dto';
import { UpdateTransactionDto } from './dto/update-print-transaction.dto';

@Controller({ path: 'transactions', version: '1' })
export class TransactionController {
  constructor(
    private readonly printTransactionService: TransactionService,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.printTransactionService.create(createTransactionDto);
  }

  @Get()
  async findAll() {
    return this.printTransactionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.printTransactionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.printTransactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.printTransactionService.remove(id);
  }
}
