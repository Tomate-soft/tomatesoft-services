import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TAUNTER_REQUEST_EVENT } from '../shared/queue.tokens';

@Controller()
export class TaunterServiceController {
  @EventPattern(TAUNTER_REQUEST_EVENT)
  handleTaunterRequest(@Payload() message: unknown) {
    console.log('TAUNTER_REQUEST_EVENT received:', message);
  }
}
