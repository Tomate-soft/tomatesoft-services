import { NestFactory } from '@nestjs/core';
import { TaunterServiceModule } from './taunter-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaunterServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE,
      queueOptions: { durable: true },
    },
  });
  await app.listen();
}
bootstrap();
