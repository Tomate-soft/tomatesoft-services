import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import {
  OPERATING_PERIOD_REPOSITORY,
  OperatingPeriodRepository,
  OperatingPeriodDto,
} from '../../domain/ports/operating-period.repository';
import { REDIS_CLIENT } from '@app/shared';

@Injectable()
export class GetPeriodsByMonthUseCase {
  constructor(
    @Inject(OPERATING_PERIOD_REPOSITORY)
    private readonly operatingPeriodRepository: OperatingPeriodRepository,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async execute(month: string): Promise<OperatingPeriodDto[]> {
    const cacheKey = `periods:${month}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const periods = await this.operatingPeriodRepository.findByMonth(month);

    await this.redis.set(cacheKey, JSON.stringify(periods));

    return periods;
  }

  // TODO: Exponer via gRPC cuando se necesite
  // async evictCache(month: string): Promise<void> {
  //   await this.redis.del(`periods:${month}`);
  // }

  // async evictAllCache(): Promise<void> {
  //   const keys = await this.redis.keys('periods:*');
  //   if (keys.length > 0) {
  //     await this.redis.del(...keys);
  //   }
  // }
}
