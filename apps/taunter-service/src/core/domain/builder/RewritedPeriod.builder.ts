import { RewritedOrder } from '../entities/RewritedOrder.entity';

export class RewritedOrderBuilder {
  private __rewritedOrder: RewritedOrder = new RewritedOrder();

  setOrderId(orderId: string): RewritedOrderBuilder {
    this.__rewritedOrder.orderId = orderId;
    return this;
  }
}
