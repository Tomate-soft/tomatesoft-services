import { Controller, Get, Query } from '@nestjs/common';
import { ReadTaunterService } from '../services/read-taunter.service';

@Controller('read-taunter')
export class ReadTaunterController {
  constructor(private readonly readTaunterService: ReadTaunterService) {}

  @Get('periods')
  async getPeriodsByMonth(@Query('month') month: string) {
    return this.readTaunterService.getPeriodsByMonth(month);
  }
}
