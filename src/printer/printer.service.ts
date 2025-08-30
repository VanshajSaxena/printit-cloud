import { CreatePrinterDto } from './dto/create-printer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Printer } from './entities/printer.entity';
import { Repository } from 'typeorm';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Injectable()
export class PrinterService {
  constructor(
    @InjectRepository(Printer) private printerRepository: Repository<Printer>,
  ) {}

  create(createPrinterDto: CreatePrinterDto) {
    const newPrinter = this.printerRepository.create(createPrinterDto);
    return this.printerRepository.save(newPrinter);
  }

  findAll() {
    return this.printerRepository.find();
  }

  findOne(id: number) {
    return this.printerRepository.findOneBy({ id });
  }

  update(id: number, updatePrinterDto: UpdatePrinterDto) {
    return this.printerRepository.update(id, updatePrinterDto);
  }

  remove(id: number) {
    return this.printerRepository.delete(id);
  }
}
