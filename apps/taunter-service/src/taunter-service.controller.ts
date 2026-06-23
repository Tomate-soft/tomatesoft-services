import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  GrpcMethod,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { CreateBulkReportsDto, TAUNTER_REQUEST_EVENT } from '@app/shared';
import { RabbitmqMessage } from '@app/shared/rabbitmq-queue/model/RabbitmqMessage';
import { ProcessTaunterReportsUseCase } from './core/application/use-cases';
import { GetPeriodsByMonthUseCase } from './core/application/use-cases/get-periods-by-month.use-case';

@Controller()
export class TaunterServiceController {
  constructor(
    @Inject(ProcessTaunterReportsUseCase)
    private readonly processTaunterReports: ProcessTaunterReportsUseCase,
    @Inject(GetPeriodsByMonthUseCase)
    private readonly getPeriodsByMonthUseCase: GetPeriodsByMonthUseCase,
  ) {}

  @GrpcMethod('TaunterService', 'GetPeriodsByMonth')
  async getPeriodsByMonth(data: { month: string }) {
    console.log('Y AQUI ESTAMOS RECIBIENDO RECIBIDO PERFECTAMENT EPOR GRPC Y TRABAJAMOS PARA REGRESAR LOS PERIODOS PARA EL MES:', data.month);
    const periods = await this.getPeriodsByMonthUseCase.execute(data.month);
    const mapped = periods.map((p: any) => ({
      ...p,
      id: p._id?.toString?.() ?? p._id,
    }));
    return { periods: mapped };
  }

  @EventPattern(TAUNTER_REQUEST_EVENT, Transport.RMQ)
  async handleTaunterRequest(
    @Payload() message: RabbitmqMessage<CreateBulkReportsDto>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const { data } = message;
      if (!data || !data.reports) {
        throw new Error(
          "El payload o la propiedad 'reports' vienen indefinidos.",
        );
      }
      console.log('TAUNTER_REQUEST_EVENT received:', data.reports.length);
      const orders = await this.processTaunterReports.execute(data);
      console.log(`Inserted ${orders.length} rewrited orders successfully`);
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error processing taunter request:', error);
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
