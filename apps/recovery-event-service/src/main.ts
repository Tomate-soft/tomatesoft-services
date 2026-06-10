import { NestFactory } from '@nestjs/core';
import { RecoveryEventServiceModule } from './recovery-event-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RecoveryEventServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
