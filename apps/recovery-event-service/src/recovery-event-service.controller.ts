import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices'; // <─── Quitamos Ctx y RmqContext
import { RecoveryEventServiceService } from './recovery-event-service.service';

@Controller()
export class RecoveryEventServiceController {
  private readonly logger = new Logger(RecoveryEventServiceController.name);

  constructor(
    private readonly recoveryEventServiceService: RecoveryEventServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.recoveryEventServiceService.getHello();
  }

  /**
   * Consumidor Automático para DLX
   * NestJS hace el ACK por ti en cuanto la función termina con éxito.
   */
  @EventPattern('TAUNTER_REQUEST_EVENT') // <─── Escuchamos la cola de Dead Letter
  async handleDeadLetter(@Payload() message: unknown) {
    // 1. Tu bloque de código se ejecuta felizmente
    this.logger.warn(
      `🚨 [DLX] Clon de ${'TAUNTER_REQUEST_EVENT'} atrapado en la cola de fallos.`,
    );
    console.log(
      '📦 Payload del mensaje fallido:',
      JSON.stringify(message, null, 2),
    );

    // 2. Al llegar a la llave de cierre (} y retornar implícitamente),
    // NestJS intercepta el flujo y le manda el ACK limpio a RabbitMQ por debajo.
  }
}
