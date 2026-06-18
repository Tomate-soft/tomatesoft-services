import { NestFactory } from '@nestjs/core';
import { TaunterServiceModule } from './taunter-service.module';
import { RabbitmqQueueModule, TAUNTER_REQUEST_EVENT } from '@app/shared';
import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

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
        patterns: [TAUNTER_REQUEST_EVENT],
      },
    },
  };

  const microService =
    await RabbitmqQueueModule.createWorkerMicroserviceOptions(options);
  const app = await NestFactory.createMicroservice(
    TaunterServiceModule,
    microService,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        console.log('\n🛑 [DEBUG VALIDATION] El payload falló en el DTO:');
        validationErrors.forEach((err) => {
          console.log(`❌ Propiedad: "${err.property}"`);
          console.log(`   Errores:`, err.constraints);
          console.log(`   Valor recibido:`, JSON.stringify(err.value));
        });
        console.log('\n');

        // Retornamos RpcException para mantener el comportamiento nativo de Nest
        return new RpcException(validationErrors);
      },
    }),
  );
  await app.listen();
}
bootstrap();
