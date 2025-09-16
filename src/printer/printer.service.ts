import { CreatePrinterDto } from './dto/create-printer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Printer } from './entities/printer.entity';
import { Repository } from 'typeorm';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { plainToInstance } from 'class-transformer';
import { PrinterResponseDto } from './dto/printer-response.dto';

@Injectable()
export class PrinterService {
  constructor(
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createPrinterDto: CreatePrinterDto) {
    const vendor = await this.vendorRepository.findOneBy({
      id: createPrinterDto.vendorId,
    });

    if (!vendor) {
      throw new NotFoundException(
        `Vendor not found for id ${createPrinterDto.vendorId}`,
      );
    }

    const newPrinter = this.printerRepository.create({
      name: createPrinterDto.name,
      capabilities: createPrinterDto.capabilities,
      vendor: vendor,
    });

    const saved = await this.printerRepository.save(newPrinter);
    return plainToInstance(PrinterResponseDto, saved);
  }

  async findAll() {
    return this.printerRepository.find();
  }

  async findOne(id: number) {
    return this.printerRepository.findOneBy({ id });
  }

  async update(id: number, updatePrinterDto: UpdatePrinterDto) {
    const printer = await this.printerRepository.findOneBy({ id });
    if (!printer) {
      throw new NotFoundException(`Printer not found for the id: ${id}`);
    }
    Object.assign(printer, updatePrinterDto);
    return this.printerRepository.save(printer);
  }

  async remove(id: number) {
    return this.printerRepository.delete(id);
  }
}
