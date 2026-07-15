import { Module } from '@nestjs/common';
import { PrometheusModule } from '@app/shared';
import { TaunterModule } from './modules/taunter/taunter.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    PrometheusModule.register({
      prefix: 'tomatesoft_',
      defaultLabels: { app: 'api-gateway' },
    }),
    TaunterModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class ApiGatewayModule {}
