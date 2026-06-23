import { Module } from '@nestjs/common';
import { join } from 'path';
import { WriteTaunterController } from './controllers/write-taunter.controller';
import { WriteTaunterService } from './services/write-taunter.service';
import { ReadTaunterController } from './controllers/read-taunter.controller';
import { ReadTaunterService } from './services/read-taunter.service';
import {
  RabbitmqQueueModule,
  GrpcModule,
  TAUNTER_REQUEST_EVENT,
} from '@app/shared';

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
  imports: [
    RabbitmqQueueModule.register(options),
    GrpcModule.register({
      name: 'TAUNTER_GRPC_CLIENT',
      url: process.env.GRPC_URL || '',
      package: 'taunter',
      protoPath: join(__dirname, 'proto', 'taunter.proto'),
    }),
  ],
  controllers: [WriteTaunterController, ReadTaunterController],
  providers: [WriteTaunterService, ReadTaunterService],
})
export class TaunterModule {}
