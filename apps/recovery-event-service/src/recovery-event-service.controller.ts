import { Controller, Get, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices'; // <─── Quitamos Ctx y RmqContext
import { RecoveryEventServiceService } from './recovery-event-service.service';
import { CreateBulkReportsDto, TAUNTER_REQUEST_EVENT } from '@app/shared';
import { RabbitmqMessage } from '@app/shared/rabbitmq-queue/model/RabbitmqMessage';

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

  @EventPattern(TAUNTER_REQUEST_EVENT, Transport.RMQ)
  async handleDeadLetter(
    @Payload() message: RabbitmqMessage<CreateBulkReportsDto>,
  ) {
    const { data } = message;
    // Una validación estructural rápida (Defensive Check) antes de romper el flujo
    if (!data || !Array.isArray(data.reports)) {
      this.logger.error(
        `❌ [DLX] Estructura de mensaje inválida o corrupta abortando procesamiento para evitar bucles.`,
      );
      return;
    }
    console.log(
      '\n🚨 [DLX] Mensaje recibido en el RecoveryEventServiceController:',
    );
    console.log('📦 Recibidos:', data.reports?.length || 0);
    this.logger.warn(
      `🚨 [DLX] Clon de ${'TAUNTER_REQUEST_EVENT'} atrapado en la cola de fallos.`,
    );
    console.log(
      '📦 Payload del mensaje fallido:',
      JSON.stringify(message, null, 2),
    );
  }
}
