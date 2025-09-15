import { CreateVendorDto } from './dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { nanoid } from 'nanoid';
import { ApplicationLogger } from 'src/logger/application-logger.service';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(VendorService.name);
  }

  async create(createVendorDto: CreateVendorDto) {
    const { email } = createVendorDto;
    const isTaken = await this.vendorRepository.existsBy({ email });
    if (isTaken) {
      throw new ConflictException(`The email ${email} already exists.`);
    }

    const newVendor = this.vendorRepository.create(createVendorDto);

    let urlId = nanoid();
    while (await this.vendorRepository.existsBy({ urlId: urlId })) {
      urlId = nanoid();
      this.logger.warn('An existing nanoid was generated.');
    }

    newVendor.urlId = urlId;
    return this.vendorRepository.save(newVendor);
  }

  async findAll() {
    return this.vendorRepository.find();
  }

  async findOne(id: number) {
    return this.vendorRepository.findOneBy({ id });
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor not found for id: ${id}`);
    }
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: number) {
    return this.vendorRepository.delete(id);
  }
}
