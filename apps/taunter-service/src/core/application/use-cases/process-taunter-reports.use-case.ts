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
import { CreateBulkReportsDto, Id, OperationalReportDto } from '@app/shared';
import { OrderId } from '../../domain/vo/order-id.vo';
import { CurrentOrdersRepository } from '../../domain/ports/currentOrders.repository';
import { CurrentOrder, OrderProduct } from '../../domain/entities/CurrentOrder';
import { OperatingPeriodDto } from '../../domain/ports/operating-period.repository';

export interface Transaction {
  paymentType: PaymentMethod;
  quantity: string;
  payQuantity: string;
  tips: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  DEBIT = 'debit',
  QR = 'qr',
  TRANSFER = 'transfer',
  CREDIT = 'credit',
  OTHER = 'other',
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
  transactions: Transaction[];
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
    const allOrders: RewritedOrder[] = [];

    for (const report of dto.reports.slice(0, 1)) {
      const periodTotalCash = Math.round(
        report.operational_closure.total_cash_in_amount,
      );

      const period = new RewritedPeriod();
      period.periodId = Id.string();
      period.reportId = report.id;

      const response = await this.currentOrderRepository.findByPeriodId(
        report.id,
        periodTotalCash,
      );

      const {
        finalBills,
        uniqueProducts,
        uniqueTableNums,
        uniqueUsers,
        finalDifference,
      } = response;

      const ajustedBills = await this.prepareCurrentOrders(
        finalBills,
        period.periodId,
      );

      await this.injectFinalBillsIntoPeriod(ajustedBills);

      const orders = await this.generateOrdersForReport(
        finalDifference,
        period.periodId,
        uniqueTableNums,
        uniqueUsers,
        uniqueProducts,
      );
      period.order_array = orders.map((o) => o.id.getValue());

      await this.periodRepository.save(period);
      allOrders.push(...orders);
    }
    // dondes estan los reportes
    const { reports } = dto;

    const formatedReports: OperatingPeriodDto[] = await Promise.all(
      reports.map((r) => this.formatOperationalClosure(r)),
    );
    const dataToCache = {
      processed: true,
      reports: formatedReports,
    };

    await this.orderRepository.saveMany(allOrders);

    return dataToCache;
  }

  private async generateOrdersForReport(
    targetAmount: number,
    periodId: string,
    uniqueTableNums: string[],
    uniqueUsers: string[],
    uniqueProducts: OrderProduct[],
  ): Promise<RewritedOrder[]> {
    const orders: RewritedOrder[] = [];
    let remaining = targetAmount;

    console.log('generateOrdersForReport: ', remaining);

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

      const order = await this.createMockOrder(
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

  private async createMockOrder(
    amount: number,
    periodId: string,
    tables: string[],
    users: string[],
    prods: OrderProduct[],
  ): Promise<RewritedOrder> {
    const products = await this.generateProducts(amount, prods);
    const subtotal =
      Math.round(products.reduce((sum, p) => sum + p.total, 0) * 100) / 100;
    const total = Math.round(subtotal * 100) / 100;

    // no hay implementacioan de impuestos, entonces el tax es 0
    const orderDetail: OrderDetail = { subtotal, tax: 0, total, products };

    const paymentDetail: PaymentDetail = {
      method: 'cash',
      amount: total,
      change: 0,
      transactions: [
        {
          paymentType: PaymentMethod.CASH,
          payQuantity: total.toString(),
          quantity: total.toString(),
          tips: '0',
        },
      ],
    };

    const userName =
      users.length > 0
        ? users[Math.floor(Math.random() * users.length)]
        : 'ANONIMO';
    const table =
      tables.length > 0
        ? tables[Math.floor(Math.random() * tables.length)]
        : '00';
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
      comments: '-',
      diner,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return RewritedOrder.create(dto);
  }

  async prepareCurrentOrders(
    CurrentOrders: CurrentOrder[],
    periodId: string,
  ): Promise<RewritedOrder[]> {
    return CurrentOrders.map((order) => {
      const dto = {
        id: Id.string(),
        order_id: OrderId.generate(),
        period_id: periodId,
        code: order.code,
        user_name: order.user_name,
        user_employee_number: order.user_employee_number,
        status: order.status,
        order_detail: order.order_detail,
        payment_detail: order.payment_detail,
        table_detail: order.table_detail,
        order_name: order.order_name || `-`,
        comments: order.comments || '-',
        diner: order.diner,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };

      return RewritedOrder.create(dto);
    });
  }

  async injectFinalBillsIntoPeriod(finalBills: RewritedOrder[]): Promise<void> {
    try {
      await this.orderRepository.saveMany(finalBills);
    } catch (error) {
      console.error('Error injecting final bills into period:', error);
    }
  }

  private async generateProducts(
    targetTotal: number,
    prods: OrderProduct[],
  ): Promise<OrderProduct[]> {
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

  async formatOperationalClosure(
    closure: OperationalReportDto,
  ): Promise<OperatingPeriodDto> {
    return {
      _id: closure.id,
      status: closure.status,
      createdAt: closure.created_at,
      operationalClousure: {
        state: closure.operational_closure.state,
        totalSellsAmount: closure.operational_closure.total_sales_amount,
        totalRestaurantAmount:
          closure.operational_closure.total_restaurant_amount,
        totalToGoOrdersAmount:
          closure.operational_closure.total_to_go_orders_amount,
        totalPhoneAmount: closure.operational_closure.total_phone_amount,
        totalRappiAmount: closure.operational_closure.total_rappi_amount,
        togoOrdersTotal: closure.operational_closure.to_go_orders_total,
        totalCashInAmount: closure.operational_closure.total_cash_in_amount,
        phoneOrdersTotal: closure.operational_closure.phone_orders_total,
        rappiOrdersTotal: closure.operational_closure.rappi_orders_total,
        totalDebitAmount: closure.operational_closure.total_debit_amount,
        totalCreditAmount: closure.operational_closure.total_credit_amount,
        totalTransferAmount: closure.operational_closure.total_transfer_amount,
        restaurantOrdersTotal:
          closure.operational_closure.restaurant_orders_total,
        finishedAccounts: closure.operational_closure.finished_accounts,
        totalDiners: closure.operational_closure.total_diners,
        numberOfDiscounts: closure.operational_closure.number_of_discounts,
        discountTotalAmount: closure.operational_closure.discount_total_amount,
        numberOfCourtesy: closure.operational_closure.number_of_courtesy,
        courtesyTotalAmount: closure.operational_closure.courtesy_total_amount,
        numberOfCancellations:
          closure.operational_closure.number_of_cancellations,
        cancellationsTotalAmount:
          closure.operational_closure.cancellations_total_amount,
        balanceSheet: {
          balanceSheet: closure.operational_closure.balance_sheet.balance_sheet,
          totalIncome: closure.operational_closure.balance_sheet.total_income,
          totalExpense: closure.operational_closure.balance_sheet.total_expense,
        },
      },
    };
  }
}
