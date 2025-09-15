import { CreatePrinterDto } from './dto/create-printer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Printer } from './entities/printer.entity';
import { Repository } from 'typeorm';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class PrinterService {
  constructor(
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createPrinterDto: CreatePrinterDto) {
    // Check if vendorId is undefined or null
    if (
      createPrinterDto.vendorId === undefined ||
      createPrinterDto.vendorId === null
    ) {
      throw new BadRequestException('Vendor ID is required.');
    }

    // Find the vendor by the provided ID
    const vendor = await this.vendorRepository.findOneBy({
      id: createPrinterDto.vendorId,
    });

    // Throw an error if the vendor is not found
    if (!vendor) {
      throw new NotFoundException('Vendor not found.');
    }

    // Create and save the new printer
    const newPrinter = this.printerRepository.create({
      name: createPrinterDto.name,
      capabilities: createPrinterDto.capabilities,
      vendor: vendor,
    });

    return this.printerRepository.save(newPrinter);
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
