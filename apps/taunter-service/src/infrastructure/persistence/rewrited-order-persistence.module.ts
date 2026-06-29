import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewritedOrderEntity } from './postgres/entities/rewrited-order.entity';
import { REWRITED_ORDER_REPOSITORY } from '../../core/domain/ports/rewrited-order.repository';
import { RewritedOrderMapper } from './postgres/mappers/rewrited-order.mapper';
import { TypeOrmRewritedOrderRepository } from './postgres/repositories/typeorm-rewrited-order.repository';
import { MongoOperatingPeriodRepository } from './mongo/repositories/operating-period.repository';
import { OPERATING_PERIOD_REPOSITORY } from '../../core/domain/ports/operating-period.repository';
import {
  OperatingPeriod,
  OperatingPeriodSchema,
} from '@app/shared/persistence/mongodb/schemas/clousures/operatingPeriod.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoCurrentOrdersRepository } from './mongo/repositories/mongo-currenOrders.repository';

const mongoSchemas = [
  { name: OperatingPeriod.name, schema: OperatingPeriodSchema },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([RewritedOrderEntity]),
    MongooseModule.forFeature(mongoSchemas),
  ],
  providers: [
    RewritedOrderMapper,
    {
      provide: REWRITED_ORDER_REPOSITORY,
      useClass: TypeOrmRewritedOrderRepository,
    },
    {
      provide: OPERATING_PERIOD_REPOSITORY,
      useClass: MongoOperatingPeriodRepository,
    },
    {
      provide: 'CURRENT_ORDER_REPOSITORY',
      useClass: MongoCurrentOrdersRepository, // Asegúrate de que esta clase esté implementada correctamente
    },
  ],

  exports: [
    REWRITED_ORDER_REPOSITORY,
    OPERATING_PERIOD_REPOSITORY,
    'CURRENT_ORDER_REPOSITORY',
  ],
})
export class RewritedOrderPersistenceModule {}
