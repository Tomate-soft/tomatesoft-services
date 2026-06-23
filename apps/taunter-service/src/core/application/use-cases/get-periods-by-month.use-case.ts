import { Inject, Injectable } from '@nestjs/common';
import {
  OPERATING_PERIOD_REPOSITORY,
  OperatingPeriodRepository,
} from '../../domain/ports/operating-period.repository';

@Injectable()
export class GetPeriodsByMonthUseCase {
  constructor(
    @Inject(OPERATING_PERIOD_REPOSITORY)
    private readonly operatingPeriodRepository: OperatingPeriodRepository,
  ) {}

  async execute(month: string) {
    const periods = await this.operatingPeriodRepository.findByMonth(month);
    return periods;
  }
}
