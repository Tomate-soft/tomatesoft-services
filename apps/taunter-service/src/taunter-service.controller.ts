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
  SaveProcessedReportsCacheUseCase,
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
    @Inject(SaveProcessedReportsCacheUseCase)
    private readonly saveProcessedReportsCache: SaveProcessedReportsCacheUseCase,
  ) {}

  @GrpcMethod('TaunterService', 'GetPeriodsByMonth')
  async getPeriodsByMonth(data: { month: string }) {
    const response = await this.getPeriodsByMonthUseCase.execute(data.month);
    const { periods, processed } = response;
    console.log('LOG DE PERIODOS QUE LLEGA AL CONTROLLER');
    console.log('periods: ', periods[0]);
    const mapped = periods?.map((p: any) => ({
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

      const dataToCache = await this.processTaunterReports.execute(data);
      await this.saveProcessedReportsCache.execute(data.month, dataToCache);
      console.log('TAUNTER_REQUEST_EVENT processed successfully:', dataToCache);

      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error processing taunter request:', error);
      context.getChannelRef().reject(context.getMessage(), false);
    }
  }
}
