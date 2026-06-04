import { Injectable } from '@nestjs/common';

@Injectable()
export class TaunterServiceService {
  getHello(): string {
    return 'Listo taunter service';
  }
}
