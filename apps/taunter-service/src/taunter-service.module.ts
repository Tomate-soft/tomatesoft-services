import { Module } from '@nestjs/common';
import { TaunterServiceController } from './taunter-service.controller';
import { GlobalModule } from './global/global.module';
import { RewritedOrderModule } from './infrastructure/rewrited-order.module';
import { RewritedPeriodModule } from './infrastructure/rewrited-period.module';

@Module({
  imports: [GlobalModule, RewritedOrderModule, RewritedPeriodModule],
  controllers: [TaunterServiceController],
  providers: [],
})
export class TaunterServiceModule {}
