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

interface OrderProduct {
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

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

const MOCK_PRODUCTS = [
  { name: 'Hamburguesa Clásica', price: 89 },
  { name: 'Hamburguesa con Queso', price: 99 },
  { name: 'Hamburguesa BBQ', price: 115 },
  { name: 'Papas Fritas Grandes', price: 45 },
  { name: 'Papas Fritas Chicas', price: 30 },
  { name: 'Refresco de Cola', price: 25 },
  { name: 'Refresco de Naranja', price: 25 },
  { name: 'Agua Natural', price: 20 },
  { name: 'Agua Mineral', price: 22 },
  { name: 'Tacos al Pastor (4)', price: 75 },
  { name: 'Tacos de Suadero (4)', price: 85 },
  { name: 'Quesadilla de Queso', price: 55 },
  { name: 'Quesadilla de Champiñones', price: 65 },
  { name: 'Guacamole con Totopos', price: 65 },
  { name: 'Flan Napolitano', price: 35 },
  { name: 'Pastel de Chocolate', price: 45 },
  { name: 'Café Americano', price: 30 },
  { name: 'Café Latte', price: 38 },
  { name: 'Jugo de Naranja Natural', price: 40 },
  { name: 'Cerveza Artesanal', price: 55 },
];

const MOCK_USER_NAMES = [
  'María García',
  'Juan Pérez',
  'Ana López',
  'Carlos Martínez',
  'Laura Sánchez',
  'Roberto Díaz',
  'Sofía Hernández',
  'Miguel Ángel',
];

const MOCK_TABLES = [
  'Mesa 1',
  'Mesa 2',
  'Mesa 3',
  'Mesa 4',
  'Mesa 5',
  'Barra',
  'Terraza 1',
  'Terraza 2',
  'Privado 1',
  'Privado 2',
];

const MOCK_COMMENTS = [
  '',
  'Sin cebolla',
  'Bien cocido',
  'Sin picante',
  'Extra queso',
  'Orden para llevar',
  '',
];

@Injectable()
export class ProcessTaunterReportsUseCase {
  constructor(
    @Inject(REWRITED_ORDER_REPOSITORY)
    private readonly orderRepository: IRewritedOrderRepository,
    @Inject(REWRITED_PERIOD_REPOSITORY)
    private readonly periodRepository: IRewritedPeriodRepository,
  ) {}

  async execute(dto: CreateBulkReportsDto): Promise<RewritedOrder[]> {
    const allOrders: RewritedOrder[] = [];

    for (const report of dto.reports) {
      const targetAmount = Math.round(
        report.operational_closure.total_cash_in_amount,
      );

      const period = new RewritedPeriod();
      period.periodId = Id.string();
      period.reportId = report.id;

      const orders = this.generateOrdersForReport(targetAmount, period.periodId);
      period.order_array = orders.map((o) => o.id.getValue());

      await this.periodRepository.save(period);
      allOrders.push(...orders);
    }

    return this.orderRepository.saveMany(allOrders);
  }

  private generateOrdersForReport(
    targetAmount: number,
    periodId: string,
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

      const orderAmount = amount > remaining ? remaining : amount;
      remaining -= orderAmount;

      if (orderAmount <= 0) break;

      const order = this.createMockOrder(orderAmount, periodId);
      orders.push(order);
    }

    return orders;
  }

  private createMockOrder(amount: number, periodId: string): RewritedOrder {
    const products = this.generateProducts(amount);
    const subtotal =
      Math.round(products.reduce((sum, p) => sum + p.total, 0) * 100) / 100;
    const tax = Math.round(subtotal * 0.16 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const orderDetail: OrderDetail = { subtotal, tax, total, products };

    const paymentDetail: PaymentDetail = {
      method: 'cash',
      amount: total,
      change: 0,
    };

    const userName =
      MOCK_USER_NAMES[Math.floor(Math.random() * MOCK_USER_NAMES.length)];
    const table = MOCK_TABLES[Math.floor(Math.random() * MOCK_TABLES.length)];
    const comment =
      MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
    const diner = Math.floor(Math.random() * 6) + 1;
    const employeeNumber = `EMP-${Math.floor(Math.random() * 900) + 100}`;

    const dto = {
      id: Id.string(),
      order_id: OrderId.generate(),
      period_id: periodId,
      code: `ORD-${Id.string().slice(0, 8).toUpperCase()}`,
      user_name: userName,
      user_employee_number: employeeNumber,
      status: 'completed',
      order_detail: orderDetail,
      payment_detail: paymentDetail,
      table_detail: table,
      order_name: `Orden ${table}`,
      comments: 'aca el comentario del cliente',
      diner,
    };

    return RewritedOrder.create(dto);
  }

  private generateProducts(targetTotal: number): OrderProduct[] {
    const products: OrderProduct[] = [];
    let remaining = Math.round(targetTotal);

    while (remaining > 0) {
      const available = MOCK_PRODUCTS.filter((p) => p.price <= remaining);
      if (available.length === 0) break;

      const product = available[Math.floor(Math.random() * available.length)];
      const maxQty = Math.floor(remaining / product.price);
      if (maxQty === 0) break;

      const quantity = Math.min(maxQty, Math.floor(Math.random() * 4) + 1);
      const lineTotal = product.price * quantity;
      remaining -= lineTotal;

      const existing = products.find((p) => p.name === product.name);
      if (existing) {
        existing.quantity += quantity;
        existing.total += lineTotal;
      } else {
        products.push({
          name: product.name,
          quantity,
          unit_price: product.price,
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
