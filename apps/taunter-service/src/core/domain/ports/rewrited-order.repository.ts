import { RewritedOrder } from '../entities/RewritedOrder.entity';
import { OrderId } from '../vo/order-id.vo';

export interface IRewritedOrderRepository {
  save(order: RewritedOrder): Promise<RewritedOrder>;
  saveMany(orders: RewritedOrder[]): Promise<RewritedOrder[]>;
  findById(id: string): Promise<RewritedOrder | null>;
  findByOrderId(orderId: OrderId | string): Promise<RewritedOrder | null>;
  findAll(): Promise<RewritedOrder[]>;
  delete(id: string): Promise<void>;
}

export const REWRITED_ORDER_REPOSITORY = 'REWRITED_ORDER_REPOSITORY';
