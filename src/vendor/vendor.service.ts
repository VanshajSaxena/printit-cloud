import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { nanoid } from 'nanoid';
import { ApplicationLogger } from 'src/logger/application-logger.service';
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { NearbyQueryDto } from './dto/vendor-nearby.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { Vendor } from './entities/vendor.entity';

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
    const { email } = createVendorDto;
    let { username } = createVendorDto;

    if (!username) {
      username = await this.generateUsername(email);
    } else {
      const taken = await this.vendorRepository.existsBy({ username });
      if (taken)
        throw new ConflictException(`Username ${username} is already taken.`);
    }

    const emailTaken = await this.vendorRepository.existsBy({ email });

    if (emailTaken)
      throw new ConflictException(`Email ${email} is already in use.`);

    const newVendor = this.vendorRepository.create(createVendorDto);

    let slug = this.generateSlug();
    while (await this.vendorRepository.existsBy({ slug })) {
      slug = this.generateSlug();
      this.logger.warn('An existing nanoid was generated.');
    }

    if (createVendorDto.password) {
      const passwordHash = await hash(createVendorDto.password, 12);
      newVendor.passwordHash = passwordHash;
    }

    newVendor.slug = slug;

    if (createVendorDto.latitude != null && createVendorDto.longitude != null) {
      newVendor.location = {
        type: 'Point',
        coordinates: [createVendorDto.longitude, createVendorDto.latitude],
      };
    }

    const saved = await this.vendorRepository.save(newVendor);

    return plainToInstance(VendorResponseDto, saved);
  }

  private generateSlug() {
    return nanoid(this.#ID_LENGTH);
  }

  private async generateUsername(email: string): Promise<string> {
    const base = email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9_]/g, '')
      .slice(0, 15)
      .toLowerCase();

    let username: string;
    do {
      username = `${base}_${nanoid(4)}`;
    } while (await this.vendorRepository.existsBy({ username }));

    return username;
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

  async findNearby(nearbyQueryDto: NearbyQueryDto) {
    const { lat, lng, range = 500000 } = nearbyQueryDto;
    const origin = `ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)`;

    const { entities, raw } = await this.vendorRepository
      .createQueryBuilder('vendor')
      .addSelect(`ST_Distance(vendor.location, ${origin})`, 'distance')
      .where(`ST_DWithin(vendor.location, ${origin}, :range)`)
      .orderBy('distance', 'ASC')
      .setParameters({
        lat,
        lng,
        range,
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

  private async findOneEntity(
    where: FindOptionsWhere<Vendor>,
    options?: FindOneOptions<Vendor>,
  ) {
    try {
      return await this.vendorRepository.findOneOrFail({
        where,
        ...options,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        const key = Object.keys(where)[0];
        const value = Object.values(where)[0];

        throw new NotFoundException(
          `Vendor with ${key} '${this.safeToString(value)}' not found.`,
        );
      }
      throw error;
    }
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
