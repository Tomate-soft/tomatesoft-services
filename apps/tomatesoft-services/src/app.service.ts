import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Hola yo soy el servicio de tomatesoft-services he estamos trabajando en el proyecto de microservicios con NestJS y se supóne que ahora no deberai hacer redseploy de el otro microservicio que es el taunter-service pero si hacemos cambios en este servicio si se tiene que hacer redeploy de el otro servicio para que pueda consumir los cambios que se hicieron en este servicio y uno mas por que no.';
  }
}
