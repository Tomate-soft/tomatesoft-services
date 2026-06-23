import { Module } from '@nestjs/common';
import { RewritedOrderPersistenceModule } from './persistence/rewrited-order-persistence.module';
import { RewritedPeriodModule } from './rewrited-period.module';
import {
  CreateRewritedOrderUseCase,
  FindRewritedOrderUseCase,
  ListRewritedOrdersUseCase,
  ProcessTaunterReportsUseCase,
} from '../core/application/use-cases';
import { GetPeriodsByMonthUseCase } from '../core/application/use-cases/get-periods-by-month.use-case';

@Module({
  imports: [RewritedOrderPersistenceModule, RewritedPeriodModule],
  providers: [
    CreateRewritedOrderUseCase,
    FindRewritedOrderUseCase,
    ListRewritedOrdersUseCase,
    ProcessTaunterReportsUseCase,
    GetPeriodsByMonthUseCase,
  ],
  exports: [
    CreateRewritedOrderUseCase,
    FindRewritedOrderUseCase,
    ListRewritedOrdersUseCase,
    ProcessTaunterReportsUseCase,
    GetPeriodsByMonthUseCase,
  ],
})
export class RewritedOrderModule {}
