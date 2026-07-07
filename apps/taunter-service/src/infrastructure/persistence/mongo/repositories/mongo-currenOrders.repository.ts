import { InjectModel } from '@nestjs/mongoose';
import {
  CurrentOrder,
  OrderProduct,
} from 'apps/taunter-service/src/core/domain/entities/CurrentOrder';
import { CurrentOrdersRepository } from 'apps/taunter-service/src/core/domain/ports/currentOrders.repository';
import { Model } from 'mongoose';
import { Bills } from '@app/shared/persistence/mongodb/schemas/pos/ops/orders/bill.schema';

export enum ProcessType {
  ADD,
  REMOVE,
}

export class MongoCurrentOrdersRepository implements CurrentOrdersRepository {
  constructor(
    @InjectModel(Bills.name) private readonly currentOrderModel: Model<Bills>,
  ) {}

  async findByPeriodId(
    periodId: string,
    periodTotalCash: number,
  ): Promise<{
    finalBills: CurrentOrder[];
    uniqueProducts: OrderProduct[];
    uniqueTableNums: string[];
    uniqueUsers: string[];
    finalDifference: number;
  }> {
    const bills = await (this.currentOrderModel as any)
      .find({ operatingPeriod: periodId })
      .populate('payment')
      .select(
        'code userCode payment products tableNum billName comments diners status user checkTotal createdAt updatedAt operatingPeriod',
      )
      .lean()
      .exec();

    const onlyEffectiveBills = this.toOnlyEffectivePayment(bills);

    const currentTotal = this.calculateCurrentTotal(onlyEffectiveBills);

    const difference = this.calculateDifference(currentTotal, periodTotalCash);

    const { finalBills, finalDifference } = await this.selectProcessType(
      onlyEffectiveBills,
      difference,
      periodTotalCash,
    );

    // este paso de momento solo verifica que tenga pago y productos las cuentas pero meteremos mas filtros en caso de necesitarse como descuentos o cuentas facturadas
    const filteredBills = await this.filteredBills(finalBills);

    const formatBills = filteredBills.map((currentBill: Bills) => {
      const bill = this.toCurrentOrder(currentBill);
      return {
        ...bill,
        order_detail: {
          ...bill.order_detail,
          total: this.calculateOrderTotal(bill.order_detail.products),
        },
      };
    });

    return this.formatResponse(
      formatBills,
      this.getUniqueProducts(formatBills),
      this.getUniqueTableNums(formatBills),
      this.getUniqueUsers(formatBills),
      finalDifference * -1,
    );
  }

  private getUniqueProducts(orders: CurrentOrder[]): OrderProduct[] {
    const productMap = new Map<string, OrderProduct>();

    for (const order of orders) {
      for (const product of order.order_detail.products) {
        const existing = productMap.get(product.productName);
        if (existing) {
          existing.quantity += product.quantity;
          existing.total += product.total;
        } else {
          productMap.set(product.productName, { ...product });
        }
      }
    }

    return Array.from(productMap.values());
  }

  private getUniqueTableNums(orders: CurrentOrder[]): string[] {
    return Array.from(new Set(orders.map((o) => o.table_detail)));
  }

  private getUniqueUsers(orders: CurrentOrder[]): string[] {
    return Array.from(new Set(orders.map((o) => o.user_name)));
  }

  private toCurrentOrder(bill: Bills): CurrentOrder {
    return {
      code: bill.code,
      user_name: bill.user,
      user_employee_number: bill.userCode,
      status: bill.status,
      order_detail: {
        subtotal: 0,
        tax: 0,
        total: 0,
        products: (bill.products || []).map((p: any) => ({
          productName: p.productName || '',
          quantity: p.quantity || 0,
          unit_price: p?.prices?.[0]?.price || 0,
          total: this.calculateProductTotal(p) || 0,
        })),
      },
      payment_detail: bill.payment.map((payment) => ({
        method: payment.paymentCode,
        amount: parseFloat(payment.checkTotal),
        change: payment.difference ? parseFloat(payment.difference) : 0,
        transactions: payment.transactions,
      })),
      table_detail: bill.tableNum,
      order_name: bill.billName || '',
      comments: bill.comments || '',
      diner: bill.diners || 1,
      billed: bill?.payment?.[0]?.billing ?? false,
      period_id: bill.operatingPeriod?.toString() || '',
      created_at: bill.createdAt,
      updated_at: bill.updatedAt,
    };
  }

  private calculateProductTotal(product: OrderProduct): number {
    return product.unit_price * product.quantity;
  }

  private calculateOrderTotal(products: OrderProduct[]): number {
    return products.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
  }

  // este metodo se usara posteriormente para sacar cuentas por ejemplo que tengasn descuento o cualquier otra coa que queramos quitar
  private async filteredBills(bills: Bills[]): Promise<Bills[]> {
    return bills.filter((bill) => {
      const hasProducts = bill.products && bill.products.length > 0;
      const hasPayment = bill.payment && bill.payment.length > 0;
      return hasProducts && hasPayment;
    });
  }

  private toOnlyEffectivePayment(bills: Bills[]): any[] {
    return bills.filter((bill) => {
      const hasEffectivePayment = bill.payment.some((payment) =>
        payment.transactions?.some(
          (transaction) => transaction.paymentType === 'cash',
        ),
      );
      return hasEffectivePayment;
    });
  }

  private setProcesstype(amount: number) {
    if (amount > 0) {
      return ProcessType.REMOVE;
    } else {
      return ProcessType.ADD;
    }
  }

  private async runAddProcess(bills: Bills[], difference: number) {}

  private calculateCurrentTotal(bills: Bills[]): number {
    const currentTotal = bills.reduce((total, bill) => {
      if (bill.checkTotal) {
        const checkTotal = parseFloat(bill.checkTotal);
        return total + checkTotal;
      }
      return total;
    }, 0);

    return currentTotal;
  }

  private calculateDifference(
    currentTotal: number,
    targetAmount: number,
  ): number {
    return currentTotal - targetAmount;
  }

  private async selectProcessType(
    bills: Bills[],
    difference: number,
    periodTotalCash: number,
  ) {
    let lght = bills.length;
    let processType = this.setProcesstype(difference);
    let MAX_ITERATIONS = 1000;

    // aqui hay que meter un bucle para en caso de que n0o sea el metodo ADD ir sacando hasta que si sea

    while (processType === ProcessType.REMOVE) {
      const loopBills = bills.slice(0, lght);

      const consultNewDifference = this.calculateDifference(
        this.calculateCurrentTotal(loopBills),
        periodTotalCash, // como esto siempre es cero nunca corta
      );

      const newType = this.setProcesstype(consultNewDifference);

      if (newType === ProcessType.ADD) {
        await this.runAddProcess(loopBills, consultNewDifference * -1);
        return {
          finalBills: loopBills,
          finalDifference: consultNewDifference,
        };
      }

      lght--;
      processType = this.setProcesstype(difference);

      if (lght <= 0 || MAX_ITERATIONS <= 0) {
        throw new Error(
          'No se pudo generar un conjunto de cuentas que cumpla con la cantidad objetivo',
        );
      }

      MAX_ITERATIONS--;
    }

    await this.runAddProcess(bills, difference);
    return {
      finalBills: bills,
      finalDifference: difference,
    };
  }

  private formatResponse(
    orders: CurrentOrder[],
    uniqueProducts: OrderProduct[],
    uniqueTableNums: string[],
    uniqueUsers: string[],
    targetAmount: number,
  ) {
    return {
      finalBills: orders,
      uniqueProducts,
      uniqueTableNums,
      uniqueUsers,
      finalDifference: targetAmount,
    };
  }
}
