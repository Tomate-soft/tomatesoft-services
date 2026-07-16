import { Controller, Get, Param, Query } from '@nestjs/common';
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
      console.log('Fetching periods for month:', month);
      if (!month) {
        throw new Error('Month query parameter is required');
      }
      const periods = await this.readTaunterService.getPeriodsByMonth(month);
      console.log(periods);
      this.metrics.requestsCounter.inc();
      if (!periods || periods.length === 0) {
        return { month: month, count: periods?.length, data: [] };
      }

      return { month: month, count: periods.length, data: periods };
    } catch (error) {
      this.metrics.requestsCounter.inc({ status: 'error' });
      console.log(error);
      throw new Error('Error fetching periods by month');
    } finally {
      end();
    }
  }

  @Get('periods/:periodId/orders')
  async getPeriodOrders(@Param('periodId') periodId: string) {
    const end = this.metrics.requestDuration.startTimer();
    try {
      const result = await this.readTaunterService.getPeriodOrders(periodId);
      this.metrics.requestsCounter.inc();
      return result;
    } finally {
      end();
    }
  }
}
