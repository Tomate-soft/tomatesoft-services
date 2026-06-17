import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { CreateBulkReportsDto, TAUNTER_REQUEST_EVENT } from '@app/shared';

@Controller()
export class TaunterServiceController {
  @EventPattern(TAUNTER_REQUEST_EVENT, Transport.RMQ)
  handleTaunterRequest(
    @Payload() data: CreateBulkReportsDto,
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log('TAUNTER_REQUEST_EVENT received:', data.reports.length);
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error processing taunter request:', error);
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
