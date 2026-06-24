import { NestFactory } from '@nestjs/core';
import { RecoveryEventServiceModule } from './recovery-event-service.module';
import { RabbitmqQueueModule } from '@app/shared/rabbitmq-queue/rabbitmq-queue.module';

// Recovery Event Service Microservice
async function bootstrap() {
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
        patterns: ['TAUNTER_REQUEST_EVENT'],
      },
    },
  };
  const microService =
    await RabbitmqQueueModule.createRecoveryMicroserviceOptions(options);

  const app = await NestFactory.createMicroservice(
    RecoveryEventServiceModule,
    microService,
  );
  await app.listen();
}
bootstrap();
