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
import { plainToInstance } from 'class-transformer';
import { VendorResponseDto } from './dto/vendor-response.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    private logger: ApplicationLogger,
  ) {
    this.logger.setContext(VendorService.name);
  }

  #ID_LENGTH = 10;

  async create(createVendorDto: CreateVendorDto) {
    const { email } = createVendorDto;
    const isTaken = await this.vendorRepository.existsBy({ email });
    if (isTaken) {
      throw new ConflictException(`The email ${email} already exists.`);
    }

    const newVendor = this.vendorRepository.create(createVendorDto);

    let urlId = nanoid(this.#ID_LENGTH);
    while (await this.vendorRepository.existsBy({ urlId: urlId })) {
      urlId = nanoid(this.#ID_LENGTH);
      this.logger.warn('An existing nanoid was generated.');
    }

    newVendor.urlId = urlId;
    const saved = await this.vendorRepository.save(newVendor);
    return plainToInstance(VendorResponseDto, saved);
  }

  async findAll() {
    const vendors = await this.vendorRepository.find();
    return plainToInstance(VendorResponseDto, vendors);
  }

  async findOne(friendlyId: string) {
    this.logger.debug(friendlyId);
    const vendor = await this.vendorRepository.findOneBy({ urlId: friendlyId });
    this.logger.debug(vendor);
    return plainToInstance(VendorResponseDto, vendor);
  }

  async findOneById(id: number) {
    const vendor = await this.findOneEntity(id);
    return plainToInstance(VendorResponseDto, vendor);
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOneEntity(id);
    Object.assign(vendor, updateVendorDto);
    const saved = await this.vendorRepository.save(vendor);
    return plainToInstance(VendorResponseDto, saved);
  }

  async remove(id: number) {
    const vendor = await this.findOneEntity(id);
    const removed = await this.vendorRepository.softRemove(vendor);
    return plainToInstance(VendorResponseDto, removed);
  }

  getEntityOne(id: number) {
    return this.findOneEntity(id);
  }

  private async findOneEntity(id: number) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor not found for id: ${id}`);
    }
    return vendor;
  }
}
