import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { GLOBAL_PREFIX } from './common/prefixes';
import { ValidationPipe } from '@nestjs/common';

// API Gateway -- --
async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const origins = [
    process.env.HISTORY_PANEL_URL,
    process.env.TAUNTER_PANEL_URL,
    process.env.ADMIN_PANEL_URL,
  ].filter(Boolean) as string[]; // Remueve undefined/strings vacíos

  app.enableCors({
    origin: origins.length > 0 ? origins : false, // Si está vacío, bloquea por defecto
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix(GLOBAL_PREFIX);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
