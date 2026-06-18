import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { CreateBulkReportsDto, TAUNTER_REQUEST_EVENT } from '@app/shared';
import { RabbitmqMessage } from '@app/shared/rabbitmq-queue/model/RabbitmqMessage';
import { ProcessTaunterReportsUseCase } from './core/application/use-cases';

@Controller()
export class TaunterServiceController {
  constructor(
    @Inject(ProcessTaunterReportsUseCase)
    private readonly processTaunterReports: ProcessTaunterReportsUseCase,
  ) {}

  @EventPattern(TAUNTER_REQUEST_EVENT, Transport.RMQ)
  async handleTaunterRequest(
    @Payload() message: RabbitmqMessage<CreateBulkReportsDto>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { data } = message;
      if (!data || !data.reports) {
        throw new Error(
          "El payload o la propiedad 'reports' vienen indefinidos.",
        );
      }
      console.log('TAUNTER_REQUEST_EVENT received:', data.reports.length);
      const orders = await this.processTaunterReports.execute(data);
      console.log(`Inserted ${orders.length} rewrited orders successfully`);
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error processing taunter request:', error);
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
