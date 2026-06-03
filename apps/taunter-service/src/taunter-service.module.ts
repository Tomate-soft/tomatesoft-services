import { Module } from '@nestjs/common';
import { TaunterServiceController } from './taunter-service.controller';
import { TaunterServiceService } from './taunter-service.service';

@Module({
  imports: [],
  controllers: [TaunterServiceController],
  providers: [TaunterServiceService],
})
export class TaunterServiceModule {}
