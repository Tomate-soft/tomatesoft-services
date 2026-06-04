import { Controller, Get } from '@nestjs/common';
import { TaunterServiceService } from './taunter-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TaunterServiceController {
  constructor(private readonly taunterServiceService: TaunterServiceService) {}

  @Get()
  getHello(): string {
    return this.taunterServiceService.getHello();
  }

  @MessagePattern('taunter_queue')
  handleTaunt(data: any): string {
    console.log('Received taunt:', data);
    return `Taunt received: ${data}`;
  }
}
