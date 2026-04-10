import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AnonUser } from './entities/anon-user.entity';

import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AnonUserService {
  constructor(
    @InjectRepository(AnonUser)
    private readonly anonUserRepo: Repository<AnonUser>,
  ) {}

  async upsertAnonUser(dto: {
    id: string;
    vendorId: number;
    userAgent?: string;
  }): Promise<void> {
    try {
      await this.anonUserRepo.query(
        `
      INSERT INTO anon_users (
        id,
        vendor_id,
        first_seen,
        last_seen,
        visit_count,
        user_agent
      )
      VALUES ($1, $2, NOW(), NOW(), 1, $3)
      ON CONFLICT (id, vendor_id)
      DO UPDATE SET
        last_seen = NOW(),
        visit_count = anon_users.visit_count + 1,
        user_agent = EXCLUDED.user_agent;
      `,
        [dto.id, dto.vendorId, dto.userAgent],
      );
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code?: string };
        if (driverError.code === '23503') {
          throw new BadRequestException('Invalid vendorId');
        }
      }

      throw error;
    }
  }
}
