import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Hola yo soy el servicio de tomatesoft-services';
  }
}
