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
import { StatusEnum } from 'src/common/types/status-enum';
import {
  CurrentUser,
  Public,
  type RequestUser,
} from 'src/decorators/public.decorator';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller({ path: 'transactions', version: '1' })
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Public()
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionRequestDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: StatusEnum })
  async findAll(
    @CurrentUser() currentUser: RequestUser,
    @Query('status') status?: StatusEnum,
  ) {
    return this.transactionService.findAll(currentUser, status);
  }

  @Public()
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
