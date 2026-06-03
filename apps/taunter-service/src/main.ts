import { NestFactory } from '@nestjs/core';
import { TaunterServiceModule } from './taunter-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TaunterServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
