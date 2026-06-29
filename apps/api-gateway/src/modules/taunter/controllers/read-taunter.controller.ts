import { Controller, Get, Query } from '@nestjs/common';
import { ReadTaunterService } from '../services/read-taunter.service';
import { PrometheusMetricsService } from '../services/prometheus-metrics.service';

@Controller('read-taunter')
export class ReadTaunterController {
  constructor(
    private readonly readTaunterService: ReadTaunterService,
    private readonly metrics: PrometheusMetricsService,
  ) {}

  @Get('periods')
  async getPeriodsByMonth(@Query('month') month: string) {
    const end = this.metrics.requestDuration.startTimer();
    try {
      const periods = await this.readTaunterService.getPeriodsByMonth(month);
      this.metrics.requestsCounter.inc();
      if (!periods || periods.length === 0) {
        return { month: month, count: periods?.length, data: [] };
      }

      return { month: month, count: periods.length, data: periods };
    } finally {
      end();
    }
  }
}
