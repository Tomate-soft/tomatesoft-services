import { Controller, Get, Query } from '@nestjs/common';
import { ReadTaunterService } from '../services/read-taunter.service';

@Controller('read-taunter')
export class ReadTaunterController {
  constructor(private readonly readTaunterService: ReadTaunterService) {}

  @Get('periods')
  async getPeriodsByMonth(@Query('month') month: string) {
    const periods = await this.readTaunterService.getPeriodsByMonth(month);
    if (!periods || periods.length === 0) {
      return { month: month, count: periods.length, data: [] };
    }

    return { month: month, count: periods.length, data: periods };
  }
}
