import { Module } from '@nestjs/common';
import { TaunterServiceController } from './taunter-service.controller';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [GlobalModule],
  controllers: [TaunterServiceController],
  providers: [],
})
export class TaunterServiceModule {}
