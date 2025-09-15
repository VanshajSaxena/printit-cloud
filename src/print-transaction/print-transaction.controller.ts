import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  async findOne(@Param('id') id: string) {
    return this.printTransactionService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrintTransactionDto: UpdatePrintTransactionDto,
  ) {
    return this.printTransactionService.update(+id, updatePrintTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.printTransactionService.remove(+id);
  }
}
