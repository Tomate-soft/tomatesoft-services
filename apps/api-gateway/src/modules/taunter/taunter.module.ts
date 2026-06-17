import { Module } from '@nestjs/common';
import { WriteTaunterController } from './controllers/write-taunter.controller';
import { WriteTaunterService } from './services/write-taunter.service';
import { RabbitmqQueueModule } from '@app/shared/rabbitmq-queue/rabbitmq-queue.module';
import { TAUNTER_REQUEST_EVENT } from '@app/shared';

const options = {
  credentials: {
    host: process.env.RABBITMQ_HOST || 'fallback_host',
    password: process.env.RABBITMQ_PASSWORD || 'fallback_password',
    port: Number(process.env.RABBITMQ_PORT) || 666,
    vhost: process.env.RABBITMQ_VHOST || '/',
    user: process.env.RABBITMQ_USER || 'fallback_user',
  },
  queue: {
    name: process.env.RABBITMQ_QUEUE_NAME || 'fallback_queue',
    deadLetter: {
      exchange: 'dlx',
      patterns: [TAUNTER_REQUEST_EVENT],
    },
  },
};

@Module({
  imports: [RabbitmqQueueModule.register(options)],
  controllers: [WriteTaunterController],
  providers: [WriteTaunterService],
})
export class TaunterModule {}
