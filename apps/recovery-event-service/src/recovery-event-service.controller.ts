import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
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
   * Consumidor específico para los cadáveres de TAUNTER_REQUEST_EVENT
   */
  @EventPattern('TAUNTER_REQUEST_EVENT') // <─── El patrón correcto directo, sin rodeos
  async handleDeadLetter(
    @Payload() message: unknown,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.warn(
        `🚨 [DLX] Clon de TAUNTER_REQUEST_EVENT atrapado en la cola de fallos.`,
      );
      console.log(
        '📦 Payload del mensaje fallido:',
        JSON.stringify(message, null, 2),
      );

      // Inspección rápida de por qué lo mandaron para acá
      const deathHeader = originalMsg.properties?.headers?.['x-death'];
      if (deathHeader && deathHeader.length > 0) {
        this.logger.error(
          `💀 Razón: ${deathHeader[0].reason} | En la cola: ${deathHeader[0].queue}`,
        );
      }

      // Confirmamos y sacamos el mensaje del DLX definitivamente
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`❌ Error procesando el reporte en el DLX: `);
      // Si algo sale mal aquí, lo dejamos en la cola para no perder el rastro
      channel.nack(originalMsg, false, true);
    }
  }
}
