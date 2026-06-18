import { Module } from '@nestjs/common';
import { RewritedOrderPersistenceModule } from './persistence/rewrited-order-persistence.module';
import { RewritedPeriodModule } from './rewrited-period.module';
import {
  CreateRewritedOrderUseCase,
  FindRewritedOrderUseCase,
  ListRewritedOrdersUseCase,
  ProcessTaunterReportsUseCase,
} from '../core/application/use-cases';

@Module({
  imports: [RewritedOrderPersistenceModule, RewritedPeriodModule],
  providers: [
    CreateRewritedOrderUseCase,
    FindRewritedOrderUseCase,
    ListRewritedOrdersUseCase,
    ProcessTaunterReportsUseCase,
  ],
  exports: [
    CreateRewritedOrderUseCase,
    FindRewritedOrderUseCase,
    ListRewritedOrdersUseCase,
    ProcessTaunterReportsUseCase,
  ],
})
export class RewritedOrderModule {}
