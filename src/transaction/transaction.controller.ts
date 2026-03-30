import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionStatus } from './enums/transaction-status.enum';
import { TransactionService } from './transaction.service';

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

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateTransactionAndJobStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransactionAndJobsStatus(
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.remove(id);
  }
}
