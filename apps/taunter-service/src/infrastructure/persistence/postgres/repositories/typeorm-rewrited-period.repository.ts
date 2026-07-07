import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RewritedPeriodMapper } from '../mappers/rewrited-period.mapper';
import { IRewritedPeriodRepository } from 'apps/taunter-service/src/core/domain/ports/rewrited-period.repository';
import { RewritedPeriodEntity } from '../entities/rewrited-period.entity';
import { RewritedPeriod } from 'apps/taunter-service/src/core/domain/entities/RewritedPeriod.aggregate';

@Injectable()
export class TypeOrmRewritedPeriodRepository implements IRewritedPeriodRepository {
  constructor(
    @InjectRepository(RewritedPeriodEntity)
    private readonly repository: Repository<RewritedPeriodEntity>,
    private readonly mapper: RewritedPeriodMapper,
  ) {}

  async save(period: RewritedPeriod): Promise<RewritedPeriod> {
    const entity = this.mapper.toPersistence(period);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<RewritedPeriod | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByPeriodId(periodId: string): Promise<RewritedPeriod | null> {
    const entity = await this.repository.findOneBy({ period_id: periodId });
    return entity ? this.mapper.toDomain(entity) : null;
  }
}
