import { CurrentOrder, OrderProduct } from '../entities/CurrentOrder';

export interface CurrentOrdersRepository {
  findByPeriodId(
    periodId: string,
    targetAmount: number,
  ): Promise<{
    finalBills: CurrentOrder[];
    uniqueProducts: OrderProduct[];
    uniqueTableNums: string[];
    uniqueUsers: string[];
    finalDifference: number;
  }>;
}
