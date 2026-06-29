import { InjectModel } from '@nestjs/mongoose';
// import { CurrentOrder } from 'apps/taunter-service/src/core/domain/entities/CurrentOrder';
import { CurrentOrdersRepository } from 'apps/taunter-service/src/core/domain/ports/currentOrders.repository';
import { Model } from 'mongoose';
import { Bills } from '@app/shared/persistence/mongodb/schemas/pos/ops/orders/bill.schema';

export class MongoCurrentOrdersRepository implements CurrentOrdersRepository {
  constructor(
    @InjectModel(Bills.name) private readonly currentOrderModel: Model<Bills>,
  ) {}

  async findByPeriodId(periodId: string) /*  Promise<CurrentOrder[]> */ {
    // Implementation details

    const bills = await this.currentOrderModel
      .find({ ope: periodId })
      .populate('payment')
      .select('code employeeNumber payment products')
      .lean()
      .exec();

    console.log('===================================');
    console.log('===========BILLS===================');
    console.log('===================================');
    console.log(bills);
  }
  // Implementation details
}
