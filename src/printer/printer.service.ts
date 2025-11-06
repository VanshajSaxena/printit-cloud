import { CreatePrinterDto } from './dto/create-printer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Printer } from './entities/printer.entity';
import { Repository } from 'typeorm';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { plainToInstance } from 'class-transformer';
import { PrinterResponseDto } from './dto/printer-response.dto';
import { VendorService } from 'src/vendor/vendor.service';

@Injectable()
export class PrinterService {
  constructor(
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    private vendorService: VendorService,
  ) {}

  async create(createPrinterDto: CreatePrinterDto) {
    const vendor = await this.vendorService.getEntityOne(
      createPrinterDto.vendorId,
    );

    const newPrinter = this.printerRepository.create({
      name: createPrinterDto.name,
      capabilities: createPrinterDto.capabilities,
      vendor: vendor,
    });

    const saved = await this.printerRepository.save(newPrinter);
    return plainToInstance(PrinterResponseDto, saved);
  }

  async findAll() {
    const printers = await this.printerRepository.find();
    return plainToInstance(PrinterResponseDto, printers);
  }

  async findOne(id: number) {
    const printer = await this.findOneEntity(id);
    return plainToInstance(PrinterResponseDto, printer);
  }

  async update(id: number, updatePrinterDto: UpdatePrinterDto) {
    const printer = await this.findOneEntity(id);
    Object.assign(printer, updatePrinterDto);
    const saved = await this.printerRepository.save(printer);
    return plainToInstance(PrinterResponseDto, saved);
  }

  async remove(id: number) {
    const printer = await this.findOneEntity(id);
    const removed = await this.printerRepository.softRemove(printer);
    return plainToInstance(PrinterResponseDto, removed);
  }

  async getOptionalEntityOne(id: number) {
    return this.printerRepository.findOneBy({ id });
  }

  async getEntityOne(id: number) {
    return this.findOneEntity(id);
  }

  private async findOneEntity(id: number) {
    const printer = await this.printerRepository.findOneBy({ id });
    if (!printer) {
      throw new NotFoundException(`Printer not found for the id: ${id}`);
    }
    return printer;
  }
}
