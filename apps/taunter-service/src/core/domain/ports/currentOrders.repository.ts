import { CurrentOrder, OrderProduct } from '../entities/CurrentOrder';

export interface CurrentOrdersRepository {
  findByPeriodId(
    periodId: string,
    targetAmount: number,
  ): Promise<{
    orders: CurrentOrder[];
    uniqueProducts: OrderProduct[];
    uniqueTableNums: string[];
    uniqueUsers: string[];
  }>;
}
