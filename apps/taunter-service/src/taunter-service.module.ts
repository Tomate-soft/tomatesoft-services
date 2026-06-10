import { Module } from '@nestjs/common';
import { TaunterServiceController } from './taunter-service.controller';

@Module({
  imports: [],
  controllers: [TaunterServiceController],
  providers: [],
})
export class TaunterServiceModule {}
