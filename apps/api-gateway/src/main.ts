import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { GLOBAL_PREFIX } from './common/prefixes';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
