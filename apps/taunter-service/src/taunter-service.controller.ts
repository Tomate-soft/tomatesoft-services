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
import {
  ProcessTaunterReportsUseCase,
  GetPeriodOrdersUseCase,
} from './core/application/use-cases';
import { GetPeriodsByMonthUseCase } from './core/application/use-cases/get-periods-by-month.use-case';

@Controller()
export class TaunterServiceController {
  constructor(
    @Inject(ProcessTaunterReportsUseCase)
    private readonly processTaunterReports: ProcessTaunterReportsUseCase,
    @Inject(GetPeriodsByMonthUseCase)
    private readonly getPeriodsByMonthUseCase: GetPeriodsByMonthUseCase,
    @Inject(GetPeriodOrdersUseCase)
    private readonly getPeriodOrdersUseCase: GetPeriodOrdersUseCase,
  ) {}

  @GrpcMethod('TaunterService', 'GetPeriodsByMonth')
  async getPeriodsByMonth(data: { month: string }) {
    const response = await this.getPeriodsByMonthUseCase.execute(data.month);
    const { periods, processed } = response;
    const mapped = periods.map((p: any) => ({
      ...p,
      id: p._id?.toString?.() ?? p._id,
    }));
    return { periods: mapped, processed: processed ?? false };
  }

  @GrpcMethod('TaunterService', 'GetPeriodOrders')
  async getPeriodOrders(data: { period_id: string }) {
    const result = await this.getPeriodOrdersUseCase.execute(data.period_id);

    return {
      period: result.period
        ? {
            id: result.period.id,
            period_id: result.period.period_id,
            report_id: result.period.report_id,
            order_ids: JSON.stringify(result.period.order_ids),
          }
        : null,
      orders: result.orders.map((o: any) => ({
        id: o.id,
        order_id: o.order_id,
        period_id: o.period_id,
        code: o.code,
        user_name: o.user_name,
        user_employee_number: o.user_employee_number,
        status: o.status,
        order_detail: JSON.stringify(o.order_detail),
        payment_detail: JSON.stringify(o.payment_detail),
        table_detail: o.table_detail,
        order_name: o.order_name,
        comments: o.comments,
        diner: o.diner,
        created_at: o.created_at?.toISOString?.() ?? o.created_at,
        updated_at: o.updated_at?.toISOString?.() ?? o.updated_at,
      })),
    };
  }

  /* REVISA EL FLUJO DESDE ABAJO Y DEJATE DE PENDEJADAS */
  /* Revisa el formato tambien de como se guardan que al final despues de ser procesado
     se guarde en el formato que pueda leer el taunter e imprima bien los tickets */

  /*  ACABO DE CONFIRTMAR QUE LOS FORMATOS SON DISTINTOS AL LEER, VERIFICA EL MOMENTO DE LEER LOS PERIODOS PARA PROCESARLOS VAMOS A HACER UN ENDPOINT RECUPERADOS DE SQL Y HAY QU EMAPEARLOS COMO SI VIENARAN DE MONGO PERO PUES CON UNA CLAVE PARA QUE YA NO SE PUEDA PROCESAR */

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
      console.log('TAUNTER_REQUEST_EVENT received:', data.month);

      const orders = await this.processTaunterReports.execute(data);

      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error processing taunter request:', error);
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
