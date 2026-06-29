import { Body, Controller, Post } from '@nestjs/common';
import { CreateBulkReportsDto } from '@app/shared';
import { WriteTaunterService } from '../services/write-taunter.service';

@Controller('write-taunter')
export class WriteTaunterController {
  constructor(private readonly writeTaunterService: WriteTaunterService) {}

  @Post('process')
  async writeTaunter(@Body() data: CreateBulkReportsDto): Promise<string> {
    console.log('Received data for writeTaunter:', data);
    await this.writeTaunterService.writeTaunter(data);
    return 'Taunter written successfully!';
  }
}
