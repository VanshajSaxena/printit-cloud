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

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const { email } = createVendorDto;
    const isTaken = await this.vendorRepository.existsBy({ email });
    if (isTaken) {
      throw new ConflictException(`The email ${email} already exists.`);
    }
    const newVendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(newVendor);
  }

  findAll() {
    return this.vendorRepository.find();
  }

  findOne(id: number) {
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

  remove(id: number) {
    return this.vendorRepository.delete(id);
  }
}
