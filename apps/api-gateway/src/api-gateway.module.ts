import { Module } from '@nestjs/common';
import { PrometheusModule } from '@app/shared';
import { TaunterModule } from './modules/taunter/taunter.module';

@Module({
  imports: [
    PrometheusModule.register({
      prefix: 'tomatesoft_',
      defaultLabels: { app: 'api-gateway' },
    }),
    TaunterModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
