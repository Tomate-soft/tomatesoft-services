import { Body, Controller, Post } from '@nestjs/common';

@Controller('write-taunter')
export class WriteTaunterController {
  constructor() {}

  @Post('process')
  writeTaunter(@Body() data: any): string {
    console.log('=============Received request to write taunter===========');
    console.log(data);
    console.log('=============Received request to write taunter===========');

    return 'Taunter written successfully!';
  }
}
