import { Module } from '@nestjs/common';
import { TaunterModule } from './modules/taunter/taunter.module';

@Module({
  imports: [TaunterModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
