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

  @MessagePattern('TAUNTER_REQUEST_EVENT')
  handleTaunt(data: any): string {
    console.log('Received taunt:', data);
    return `Taunt received: ${data}`;
  }
}
