import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { TAUNTER_REQUEST_EVENT } from '../shared/queue.tokens';

@Controller()
export class TaunterServiceController {
  @EventPattern(TAUNTER_REQUEST_EVENT, Transport.RMQ)
  handleTaunterRequest(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    console.log('TAUNTER_REQUEST_EVENT received:', data);
    // CASO ÉXITO: Le confirmamos a RabbitMQ para que borre el mensaje de la cola
    // context.getChannelRef().ack(context.getMessage());
    context.getChannelRef().reject(context.getMessage(), false);
  }
}
