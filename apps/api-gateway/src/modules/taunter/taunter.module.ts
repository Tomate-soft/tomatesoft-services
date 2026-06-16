import { Module } from '@nestjs/common';
import { WriteTaunterController } from './controllers/write-taunter.controller';
import { WriteTaunterService } from './services/write-taunter.service';

@Module({
  controllers: [WriteTaunterController],
  providers: [WriteTaunterService],
})
export class TaunterModule {}
