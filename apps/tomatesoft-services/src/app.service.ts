import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Hola yo soy el servicio de tomatesoft-services he estamos trabajando en el proyecto de microservicios con NestJS';
  }
}
