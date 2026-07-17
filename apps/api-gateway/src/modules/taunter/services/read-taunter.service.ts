import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

interface TaunterServiceClient {
  getPeriodsByMonth(data: { month: string }): Observable<{ periods: any[]; processed: boolean }>;
  getPeriodOrders(data: { period_id: string }): Observable<any>;
}

@Injectable()
export class ReadTaunterService implements OnModuleInit {
  private taunterService: TaunterServiceClient;

  constructor(
    @Inject('TAUNTER_GRPC_CLIENT') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.taunterService =
      this.grpcClient.getService<TaunterServiceClient>('TaunterService');
  }

  async getPeriodsByMonth(month: string): Promise<{ periods: any[]; processed: boolean }> {
    return firstValueFrom(
      this.taunterService.getPeriodsByMonth({ month }),
    );
  }

  async getPeriodOrders(periodId: string): Promise<any> {
    const response = await firstValueFrom(
      this.taunterService.getPeriodOrders({ period_id: periodId }),
    );
    return {
      period: response.period
        ? {
            ...response.period,
            order_ids: response.period.order_ids
              ? JSON.parse(response.period.order_ids)
              : [],
          }
        : null,
      orders: (response.orders || []).map((o: any) => ({
        ...o,
        order_detail: safeParse(o.order_detail),
        payment_detail: safeParse(o.payment_detail),
        created_at: o.created_at ?? null,
        updated_at: o.updated_at ?? null,
      })),
    };
  }
}

function safeParse(value: string | null | undefined): any {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
