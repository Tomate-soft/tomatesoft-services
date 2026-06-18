import { Module } from '@nestjs/common';
import { TaunterServiceController } from './taunter-service.controller';
import { GlobalModule } from './global/global.module';
import { RewritedOrderModule } from './infrastructure/rewrited-order.module';

@Module({
  imports: [GlobalModule, RewritedOrderModule],
  controllers: [TaunterServiceController],
  providers: [],
})
export class TaunterServiceModule {}
