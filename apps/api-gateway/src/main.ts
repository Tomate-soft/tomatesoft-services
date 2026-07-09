import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { GLOBAL_PREFIX } from './common/prefixes';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(ApiGatewayModule);

  // 1. Debug de Variables de Entorno (Sanity Check)
  const envCheck = {
    PORT: process.env.PORT || process.env.port || '3000 (Default)',
    NODE_ENV: process.env.NODE_ENV || 'development',
    HISTORY_PANEL_URL: process.env.HISTORY_PANEL_URL || 'NOT_FOUND',
    TAUNTER_PANEL_URL: process.env.TAUNTER_PANEL_URL || 'NOT_FOUND',
    ADMIN_PANEL_URL: process.env.ADMIN_PANEL_URL || 'NOT_FOUND',
  };

  console.log('\n=== ENV VARIABLES CHECK ===');
  console.table(envCheck);
  console.log('===========================\n');

  const allowedOrigins = [
    process.env.HISTORY_PANEL_URL,
    process.env.TAUNTER_PANEL_URL,
    process.env.ADMIN_PANEL_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  // 3. Pipes Globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Prefijo Global
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const port = process.env.PORT || process.env.port || 3000;
  await app.listen(port);

  logger.log(
    `API Gateway running on port: ${port} with prefix: /${GLOBAL_PREFIX}`,
  );
}

bootstrap();
