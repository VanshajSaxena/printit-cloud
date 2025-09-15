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
import { PrintTransactionService } from './print-transaction.service';
import { CreatePrintTransactionDto } from './dto/create-print-transaction.dto';
import { UpdatePrintTransactionDto } from './dto/update-print-transaction.dto';

@Controller({ path: 'transactions', version: '1' })
export class PrintTransactionController {
  constructor(
    private readonly printTransactionService: PrintTransactionService,
  ) {}

  @Post()
  async create(@Body() createPrintTransactionDto: CreatePrintTransactionDto) {
    return this.printTransactionService.create(createPrintTransactionDto);
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
    @Body() updatePrintTransactionDto: UpdatePrintTransactionDto,
  ) {
    return this.printTransactionService.update(id, updatePrintTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.printTransactionService.remove(id);
  }
}
