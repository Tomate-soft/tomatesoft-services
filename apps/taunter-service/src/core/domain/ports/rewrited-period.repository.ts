import { RewritedPeriod } from '../entities/RewritedPeriod.aggregate';

export interface IRewritedPeriodRepository {
  save(period: RewritedPeriod): Promise<RewritedPeriod>;
  findById(id: string): Promise<RewritedPeriod | null>;
}

export const REWRITED_PERIOD_REPOSITORY = 'REWRITED_PERIOD_REPOSITORY';
