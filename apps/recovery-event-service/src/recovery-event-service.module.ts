import { Module } from '@nestjs/common';
import { RecoveryEventServiceController } from './recovery-event-service.controller';
import { RecoveryEventServiceService } from './recovery-event-service.service';

@Module({
  imports: [],
  controllers: [RecoveryEventServiceController],
  providers: [RecoveryEventServiceService],
})
export class RecoveryEventServiceModule {}
