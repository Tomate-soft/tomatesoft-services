import { InjectModel } from '@nestjs/mongoose';
import {
  CurrentOrder,
  OrderProduct,
} from 'apps/taunter-service/src/core/domain/entities/CurrentOrder';
import { CurrentOrdersRepository } from 'apps/taunter-service/src/core/domain/ports/currentOrders.repository';
import { Model } from 'mongoose';
import { Bills } from '@app/shared/persistence/mongodb/schemas/pos/ops/orders/bill.schema';

export class MongoCurrentOrdersRepository implements CurrentOrdersRepository {
  constructor(
    @InjectModel(Bills.name) private readonly currentOrderModel: Model<Bills>,
  ) {}

  async findByPeriodId(
    periodId: string,
    targetAmount: number,
  ): Promise<CurrentOrder[]> {
    const bills = await (this.currentOrderModel as any)
      .find({ operatingPeriod: periodId })
      .populate('payment')
      .select(
        'code userCode payment products tableNum billName comments diners status user',
      )
      .lean()
      .exec();

    const filteredBills = this.filteredBills(bills, targetAmount);

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
    console.log(formatBills[0]);
    console.log(formatBills[0].order_detail.products[0]);

    return formatBills;
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
      payment_detail: bill.payment,
      table_detail: { tableNum: bill.tableNum, table: bill.table },
      order_name: bill.billName || '',
      comments: bill.comments || '',
      diner: bill.diners || 1,
      billed: bill?.payment?.[0]?.billing ?? false,
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

  private filteredBills(bills: Bills[], targetAmount: number): Bills[] {
    // aca vamos a sacar ordenes hasta estar cerca del targetAmount, para eso vamos a filtrar las ordenes que tengan productos y pagos

    // primero tenemos que saber el total de las bills que tenemos haciendo un reduce a la prop checkTotal de cada bill, y sumandolo a un total acumulado teniendo en cuenta que puede ser un string checkTotal en la mayoriad e los caasos ssi es que no siempre es un string, entonces tenemos que parsearlo a float y sumarlo al total acumulado, y si no es un string entonces lo sumamos directamente al total acumulado, y si no tiene checkTotal entonces lo ignoramos y seguimos con la siguiente bill
    const currentTotal = bills.reduce((total, bill) => {
      if (bill.checkTotal) {
        const checkTotal = parseFloat(bill.checkTotal);
        return total + checkTotal;
      }
      return total;
    }, 0);
    console.log('currentTotal --->', currentTotal);
    console.log('targetAmount --->', targetAmount);

    return bills.filter((bill) => {
      const hasProducts = bill.products && bill.products.length > 0;
      const hasPayment = bill.payment && bill.payment.length > 0;
      return hasProducts && hasPayment;
    });
  }
}
