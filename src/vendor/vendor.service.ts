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
import { LocationDto } from './dto/location.dto';

interface VendorRawResult {
  vendor_id: number;
  distance: string;
}

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
    const { email, username } = createVendorDto;
    const isTaken = await this.vendorRepository.existsBy([
      { email },
      { username },
    ]);
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

    if (createVendorDto.latitude != null && createVendorDto.longitude != null) {
      newVendor.location = {
        type: 'Point',
        coordinates: [createVendorDto.longitude, createVendorDto.latitude],
      };
    }

    const saved = await this.vendorRepository.save(newVendor);

    const dto = plainToInstance(VendorResponseDto, saved);

    if (saved.location) {
      dto.location = new LocationDto();
      dto.location.latitude = saved.location.coordinates[1];
      dto.location.longitude = saved.location.coordinates[0];
    } else {
      dto.location = null;
    }

    return dto;
  }

  async findAll() {
    const vendors = await this.vendorRepository.find();
    return plainToInstance(VendorResponseDto, vendors);
  }

  async findOne(selector: string) {
    if (selector.startsWith('@')) {
      return this.findOneByUsername(selector.substring(1));
    }
    if (/^\d+$/.test(selector)) {
      return this.findOneById(Number(selector));
    }
    return this.findOneBySlug(selector);
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

    if (updateVendorDto.latitude && updateVendorDto.longitude) {
      vendor.location = {
        type: 'Point',
        coordinates: [updateVendorDto.longitude, updateVendorDto.latitude],
      };
    }

    Object.assign(vendor, updateVendorDto);
    const saved = await this.vendorRepository.save(vendor);
    return plainToInstance(VendorResponseDto, saved);
  }

  async findNearby(lat: number, long: number, rangeInMeters: number = 5000) {
    const origin = `ST_SetSRID(ST_MakePoint(:long, :lat), 4326)`;

    const { entities, raw } = await this.vendorRepository
      .createQueryBuilder('vendor')
      .addSelect(`ST_Distance(vendor.location, ${origin})`, 'distance')
      .where(`ST_DWithin(vendor.location, ${origin}, :range)`)
      .orderBy('distance', 'ASC')
      .setParameters({
        lat,
        long,
        range: rangeInMeters,
      })
      .getRawAndEntities<VendorRawResult>();

    const distanceMap = new Map<number, number>();

    raw.forEach((item) => {
      distanceMap.set(item.vendor_id, Math.round(parseFloat(item.distance)));
    });

    const results = entities.map((vendor) => {
      return {
        ...vendor,
        distance: distanceMap.get(vendor.id) ?? 0,
        location: {
          latitude: vendor.location?.coordinates[1],
          longitude: vendor.location?.coordinates[0],
        },
      };
    });

    return plainToInstance(VendorResponseDto, results);
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
