import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiQuery } from '@nestjs/swagger';
import { TransactionStatus } from './enums/transaction-status.enum';

@Controller({ path: 'transactions', version: '1' })
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionRequestDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
  async findAll(@Query('status') status?: TransactionStatus) {
    return this.transactionService.findAll(status);
  }

  @Get(':id/status')
  async findTransactionStatus(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findTransactionStatus(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.remove(id);
  }
}
