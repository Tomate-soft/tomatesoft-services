import { Inject, Injectable } from '@nestjs/common';
import {
  IRewritedOrderRepository,
  REWRITED_ORDER_REPOSITORY,
} from '../../domain/ports/rewrited-order.repository';
import {
  IRewritedPeriodRepository,
  REWRITED_PERIOD_REPOSITORY,
} from '../../domain/ports/rewrited-period.repository';

export interface PeriodOrdersResponse {
  period: {
    id: string;
    period_id: string;
    report_id: string;
    order_ids: any;
  };
  orders: Array<{
    id: string;
    order_id: string;
    period_id: string;
    code: string;
    user_name: string;
    user_employee_number: string;
    status: string;
    order_detail: any;
    payment_detail: any;
    table_detail: string;
    order_name: string;
    comments: string;
    diner: number;
    created_at: Date;
    updated_at: Date;
  }>;
}

@Injectable()
export class GetPeriodOrdersUseCase {
  constructor(
    @Inject(REWRITED_ORDER_REPOSITORY)
    private readonly orderRepository: IRewritedOrderRepository,
    @Inject(REWRITED_PERIOD_REPOSITORY)
    private readonly periodRepository: IRewritedPeriodRepository,
  ) {}

  async execute(periodId: string): Promise<PeriodOrdersResponse> {
    const [period, orders] = await Promise.all([
      this.periodRepository.findByPeriodId(periodId),
      this.orderRepository.findByPeriodId(periodId),
    ]);

    if (!period) {
      return { period: null, orders: [] };
    }

    return {
      period: {
        id: period.id.getValue(),
        period_id: period.periodId,
        report_id: period.reportId,
        order_ids: period.order_array,
      },
      orders: orders.map((o) => ({
        id: o.id.getValue(),
        order_id: o.orderId.getValue(),
        period_id: o.periodId,
        code: o.code,
        user_name: o.userName,
        user_employee_number: o.userEmployeeNumber,
        status: o.status,
        order_detail: o.orderDetail,
        payment_detail: o.paymentDetail,
        table_detail: o.tableDetail,
        order_name: o.orderName,
        comments: o.comments,
        diner: o.diner,
        created_at: o.createdAt,
        updated_at: o.updatedAt,
      })),
    };
  }
}
