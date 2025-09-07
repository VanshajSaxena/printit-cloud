import { CreateVendorDto } from './dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
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

  update(id: number, updateVendorDto: UpdateVendorDto) {
    return this.vendorRepository.update(id, updateVendorDto);
  }

  remove(id: number) {
    return this.vendorRepository.delete(id);
  }
}
