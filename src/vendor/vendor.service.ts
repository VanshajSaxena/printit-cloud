import { CreateVendorDto } from './dto/create-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
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

    let slug = nanoid(this.#ID_LENGTH);
    while (await this.vendorRepository.existsBy({ slug: slug })) {
      slug = nanoid(this.#ID_LENGTH);
      this.logger.warn('An existing nanoid was generated.');
    }

    newVendor.slug = slug;
    const saved = await this.vendorRepository.save(newVendor);
    return plainToInstance(VendorResponseDto, saved);
  }

  async findAll() {
    const vendors = await this.vendorRepository.find();
    return plainToInstance(VendorResponseDto, vendors);
  }

  async findOneBySlug(slug: string) {
    const vendor = await this.findOneEntity({ slug });
    return plainToInstance(VendorResponseDto, vendor);
  }

  async findOneByUsername(username: string) {
    const vendor = await this.findOneEntity({ username });
    return plainToInstance(VendorResponseDto, vendor);
  }

  async findOneById(id: number) {
    const vendor = await this.findOneEntity({ id });
    return plainToInstance(VendorResponseDto, vendor);
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOneEntity({ id });
    Object.assign(vendor, updateVendorDto);
    const saved = await this.vendorRepository.save(vendor);
    return plainToInstance(VendorResponseDto, saved);
  }

  async remove(id: number) {
    const vendor = await this.findOneEntity({ id });
    const removed = await this.vendorRepository.softRemove(vendor);
    return plainToInstance(VendorResponseDto, removed);
  }

  getEntityOne(id: number) {
    return this.findOneEntity({ id });
  }

  private async findOneEntity(where: FindOptionsWhere<Vendor>) {
    const vendor = await this.vendorRepository.findOneBy(where);
    if (!vendor) {
      const key = Object.keys(where)[0];
      const value = Object.values(where)[0];
      throw new NotFoundException(
        `Vendor with ${key} '${this.safeToString(value)}' not found.`,
      );
    }
    return vendor;
  }

  safeToString(value: unknown): string {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value);
    }

    try {
      return JSON.stringify(value);
    } catch {
      return '[object]';
    }
  }
}
