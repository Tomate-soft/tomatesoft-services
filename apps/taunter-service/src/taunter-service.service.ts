import { Injectable } from '@nestjs/common';

@Injectable()
export class TaunterServiceService {
  getHello(): string {

    return 'Hello World! Hola yo soy el servicio de taunter-service';
  }
}
