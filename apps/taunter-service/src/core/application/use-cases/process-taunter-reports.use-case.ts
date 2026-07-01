import { Inject, Injectable } from '@nestjs/common';
import {
  IRewritedOrderRepository,
  REWRITED_ORDER_REPOSITORY,
} from '../../domain/ports/rewrited-order.repository';
import {
  IRewritedPeriodRepository,
  REWRITED_PERIOD_REPOSITORY,
} from '../../domain/ports/rewrited-period.repository';
import { RewritedOrder } from '../../domain/entities/RewritedOrder.entity';
import { RewritedPeriod } from '../../domain/entities/RewritedPeriod.aggregate';
import { CreateBulkReportsDto, Id } from '@app/shared';
import { OrderId } from '../../domain/vo/order-id.vo';
import { CurrentOrdersRepository } from '../../domain/ports/currentOrders.repository';
import { OrderProduct } from '../../domain/entities/CurrentOrder';

interface OrderDetail {
  subtotal: number;
  tax: number;
  total: number;
  products: OrderProduct[];
}

interface PaymentDetail {
  method: string;
  amount: number;
  change: number;
}

@Injectable()
export class ProcessTaunterReportsUseCase {
  constructor(
    @Inject(REWRITED_ORDER_REPOSITORY)
    private readonly orderRepository: IRewritedOrderRepository,
    @Inject(REWRITED_PERIOD_REPOSITORY)
    private readonly periodRepository: IRewritedPeriodRepository,
    @Inject('CURRENT_ORDER_REPOSITORY')
    private readonly currentOrderRepository: CurrentOrdersRepository,
  ) {}
  // aca vamos a recibir ya todo, los productos los nombres y las mesas entonces deberiamos poder sustituir el proceso identico pero sin las variables sin no con la info que no regresa el mismo metodo junto con las cuentas.
  async execute(dto: CreateBulkReportsDto) /* : Promise<RewritedOrder[]>  */ {
    // const report = dto.reports[0];
    // const targetAmount = Math.round(
    //   report.operational_closure.total_cash_in_amount,
    // );

    const allOrders: RewritedOrder[] = [];

    for (const report of dto.reports) {
      const targetAmount = Math.round(
        report.operational_closure.total_cash_in_amount,
      );
      console.log('Estaamos buscando llegar a la cantidad de: ', targetAmount);

      const period = new RewritedPeriod();
      period.periodId = Id.string();
      period.reportId = report.id;

      const response = await this.currentOrderRepository.findByPeriodId(
        report.id,
        targetAmount,
      );

      const { /* orders,*/ uniqueProducts, uniqueTableNums, uniqueUsers } =
        response;

      const orders = this.generateOrdersForReport(
        targetAmount,
        period.periodId,
        uniqueTableNums,
        uniqueUsers,
        uniqueProducts,
      );
      period.order_array = orders.map((o) => o.id.getValue());

      await this.periodRepository.save(period);
      allOrders.push(...orders);
    }

    return this.orderRepository.saveMany(allOrders);
  }

  private generateOrdersForReport(
    targetAmount: number,
    periodId: string,
    uniqueTableNums: string[],
    uniqueUsers: string[],
    uniqueProducts: OrderProduct[],
  ): RewritedOrder[] {
    const orders: RewritedOrder[] = [];
    let remaining = targetAmount;

    if (remaining <= 0) return orders;

    while (remaining > 0) {
      const maxOrderAmount = Math.min(remaining, 500);
      const minOrderAmount = Math.min(30, maxOrderAmount);
      const amount =
        minOrderAmount +
        Math.floor(Math.random() * (maxOrderAmount - minOrderAmount + 1));

      // aqui no shace falta tomar en cuenta el taxrate
      const orderAmount = amount > remaining ? remaining : amount;
      remaining -= orderAmount;

      if (orderAmount <= 0) break;

      const order = this.createMockOrder(
        orderAmount,
        periodId,
        uniqueTableNums,
        uniqueUsers,
        uniqueProducts,
      );
      orders.push(order);
    }

    return orders;
  }

  private createMockOrder(
    amount: number,
    periodId: string,
    tables: string[],
    users: string[],
    prods: OrderProduct[],
  ): RewritedOrder {
    const products = this.generateProducts(amount, prods);
    const subtotal =
      Math.round(products.reduce((sum, p) => sum + p.total, 0) * 100) / 100;
    const total = Math.round(subtotal * 100) / 100;

    // no hay implementacioan de impuestos, entonces el tax es 0
    const orderDetail: OrderDetail = { subtotal, tax: 0, total, products };

    const paymentDetail: PaymentDetail = {
      method: 'cash',
      amount: total,
      change: 0,
    };

    const userName = users[Math.floor(Math.random() * users.length)];
    const table = tables[Math.floor(Math.random() * tables.length)];
    // const comment = 'Sin comentarios'; // Puedes personalizar los comentarios según tus necesidades
    const diner = Math.floor(Math.random() * 6) + 1;
    const employeeNumber = `EMP-${Math.floor(Math.random() * 900) + 100}`;

    const dto = {
      id: Id.string(),
      order_id: OrderId.generate(),
      period_id: periodId,
      code: `ORD-${Id.string().slice(0, 8).toUpperCase()}`, // Esto ocupamos
      user_name: userName, // esto puede ser que tambien
      user_employee_number: employeeNumber, // este igual lo ocupamos
      status: 'completed', // este status tmabien lo ocupamos
      order_detail: orderDetail, // todo lo qu eva aqui dentro
      payment_detail: paymentDetail, // y lo del pago tambien
      table_detail: table, // y lo de la mesa tambien
      order_name: `Orden ${table}`,
      comments: '-',
      diner, // numero de comensales, este lo ocupamos tambien
    };

    return RewritedOrder.create(dto);
  }

  private generateProducts(
    targetTotal: number,
    prods: OrderProduct[],
  ): OrderProduct[] {
    const products: OrderProduct[] = [];
    let remaining = Math.round(targetTotal);

    while (remaining > 0) {
      const available = prods.filter((p) => p.unit_price <= remaining);
      if (available.length === 0) break;

      const product = available[Math.floor(Math.random() * available.length)];
      const maxQty = Math.floor(remaining / product.unit_price);
      if (maxQty === 0) break;

      const quantity = Math.min(maxQty, Math.floor(Math.random() * 4) + 1);
      const lineTotal = product.unit_price * quantity;
      remaining -= lineTotal;

      const existing = products.find(
        (p) => p.productName === product.productName,
      );
      if (existing) {
        existing.quantity += quantity;
        existing.total += lineTotal;
      } else {
        products.push({
          productName: product.productName,
          quantity,
          unit_price: product.unit_price,
          total: lineTotal,
        });
      }
    }

    if (remaining > 0 && products.length > 0) {
      const last = products[products.length - 1];
      last.total += remaining;
    }

    return products;
  }
}
