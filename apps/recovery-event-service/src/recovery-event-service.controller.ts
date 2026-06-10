import { Controller, Get } from '@nestjs/common';
import { RecoveryEventServiceService } from './recovery-event-service.service';

@Controller()
export class RecoveryEventServiceController {
  constructor(
    private readonly recoveryEventServiceService: RecoveryEventServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.recoveryEventServiceService.getHello();
  }
}
