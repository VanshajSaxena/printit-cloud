import { Injectable } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
  ) {}

  create(createVendorDto: CreateVendorDto) {
    const newVendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(newVendor);
  }

  findAll() {
    return this.vendorRepository.find();
  }

  findOne(id: number) {
    return this.vendorRepository.findBy({ id: id });
  }

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return this.vendorRepository.update(id, updateVendorDto);
  }

  remove(id: number) {
    return this.vendorRepository.delete(id);
  }
}
