import { Injectable } from '@nestjs/common';

@Injectable()
export class TaunterServiceService {
  getHello(): string {

    return 'Hello World! Hola yo soy el servicio de taunter-service, sin embargo ahora si deberairedeployarse y por el momento se hara de´ploy en lños dos, pero se supone que si hacemos cambios en el servicio de tomatesoft-services no se tiene que hacer redeploy del servicio de taunter-service para que pueda consumir los cambios que se hicieron en el servicio de tomatesoft-services y uno mas por que no. , com ya esta corregidom ahora si deberia de diferenciarse y hacer de plaoy enc ad auno con normalidad';
  }
}
