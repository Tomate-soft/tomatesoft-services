import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewritedOrderEntity } from './entities/rewrited-order.entity';
import { RewritedOrderMapper } from './mappers/rewrited-order.mapper';
import { TypeOrmRewritedOrderRepository } from './repositories/typeorm-rewrited-order.repository';
import {
  IRewritedOrderRepository,
  REWRITED_ORDER_REPOSITORY,
} from '../../core/domain/ports/rewrited-order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RewritedOrderEntity])],
  providers: [
    RewritedOrderMapper,
    {
      provide: REWRITED_ORDER_REPOSITORY,
      useClass: TypeOrmRewritedOrderRepository,
    },
  ],
  exports: [REWRITED_ORDER_REPOSITORY],
})
export class RewritedOrderPersistenceModule {}
