import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@app/shared';
import { OperatingPeriodDto } from '../../domain/ports/operating-period.repository';

@Injectable()
export class SaveProcessedReportsCacheUseCase {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async execute(
    month: string,
    data: { processed: boolean; periods: OperatingPeriodDto[] },
  ): Promise<void> {
    await this.redis.set(`periods:${month}`, JSON.stringify(data));
  }
}
