import { CurrentOrder } from '../entities/CurrentOrder';

export interface CurrentOrdersRepository {
  findByPeriodId(
    periodId: string,
    targetAmount: number,
  ): Promise<CurrentOrder[]>;
}
