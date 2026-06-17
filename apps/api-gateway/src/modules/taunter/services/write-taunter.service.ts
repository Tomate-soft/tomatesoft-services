import { Injectable } from '@nestjs/common';
import { RabbitmqProducerClient } from '@app/shared/rabbitmq-queue/services/rabbitmq-producer-client.service';
import { CreateBulkReportsDto, TAUNTER_REQUEST_EVENT } from '@app/shared';
import { RabbitmqMessage } from '@app/shared/rabbitmq-queue/model/RabbitmqMessage';

@Injectable()
export class WriteTaunterService {
  constructor(private readonly rabbitmq: RabbitmqProducerClient) {}

  async writeTaunter(
    data: CreateBulkReportsDto,
  ): Promise<RabbitmqMessage<CreateBulkReportsDto>> {
    const payload = this.rabbitmq.emitTo<CreateBulkReportsDto>(
      TAUNTER_REQUEST_EVENT,
      data,
    );
    return payload;
  }
}
