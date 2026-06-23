import { Controller, Get, Query } from '@nestjs/common';
import { ReadTaunterService } from '../services/read-taunter.service';

@Controller('read-taunter')
export class ReadTaunterController {
  constructor(private readonly readTaunterService: ReadTaunterService) {}

  @Get('periods')
  async getPeriodsByMonth(@Query('month') month: string) {
    console.log("AQUI PETICION RECIBIDA EN AL API GATEWAY SE LOS VAMOS APEDIR POR GRPC AL MICROSERVICIO DE TAUNTER");
    return this.readTaunterService.getPeriodsByMonth(month);
  }
}
