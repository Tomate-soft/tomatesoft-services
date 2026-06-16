import { Body, Controller, Post } from '@nestjs/common';
import { CreateBulkReportsDto } from '../dto/bulk-report.dtl';
import { WriteTaunterService } from '../services/write-taunter.service';

@Controller('write-taunter')
export class WriteTaunterController {
  constructor(private readonly writeTaunterService: WriteTaunterService) {}

  @Post('process')
  async writeTaunter(@Body() data: CreateBulkReportsDto): Promise<string> {
    await this.writeTaunterService.writeTaunter(data);
    return 'Taunter written successfully!';
  }
}
