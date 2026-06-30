import { InjectModel } from '@nestjs/mongoose';
import { CurrentOrder } from 'apps/taunter-service/src/core/domain/entities/CurrentOrder';
import { CurrentOrdersRepository } from 'apps/taunter-service/src/core/domain/ports/currentOrders.repository';
import { Model } from 'mongoose';
import { Bills } from '@app/shared/persistence/mongodb/schemas/pos/ops/orders/bill.schema';

export class MongoCurrentOrdersRepository implements CurrentOrdersRepository {
  constructor(
    @InjectModel(Bills.name) private readonly currentOrderModel: Model<Bills>,
  ) {}

  async findByPeriodId(periodId: string): Promise<CurrentOrder[]> {
    const bills = await (this.currentOrderModel as any)
      .find({ operatingPeriod: periodId })
      .populate('payment')
      .select(
        'code userCode payment products tableNum billName comments diners status user',
      )
      .lean()
      .exec();

    console.log(bills[0].payment);
    console.log(bills[0].payment.transactions[0]);
    console.log(bills[0].products[0]);

    return bills.map(this.toCurrentOrder);
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
        total: parseFloat(bill.checkTotal) || 0,
        products: (bill.products || []).map((p: any) => ({
          name: p.name || '',
          quantity: p.quantity || 0,
          unit_price: p.unit_price || 0,
          total: p.total || 0,
        })),
      },
      payment_detail: bill.payment,
      table_detail: { tableNum: bill.tableNum, table: bill.table },
      order_name: bill.billName || '',
      comments: bill.comments || '',
      diner: bill.diners || 1,
      billed: bill?.payment[0].billing ?? false,
    };
  }
}
