import { Injectable } from '@nestjs/common';

@Injectable()
export class TaunterServiceService {
  getHello(): string {

    return 'Hello World! Hola yo soy el servicio de taunter-service, sin embargo ahora si deberairedeployarse y por el momento se hara de´ploy en lños dos';
  }
}
