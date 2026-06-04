import { Controller, Get } from '@nestjs/common';
import { TaunterServiceService } from './taunter-service.service';

@Controller()
export class TaunterServiceController {
  constructor(private readonly taunterServiceService: TaunterServiceService) {}

  @Get()
  getHello(): string {
    return this.taunterServiceService.getHello();
  }
}
// force