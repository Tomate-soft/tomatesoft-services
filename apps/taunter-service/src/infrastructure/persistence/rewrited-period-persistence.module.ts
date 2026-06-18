import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewritedPeriodEntity } from './entities/rewrited-period.entity';
import { RewritedPeriodMapper } from './mappers/rewrited-period.mapper';
import { TypeOrmRewritedPeriodRepository } from './repositories/typeorm-rewrited-period.repository';
import {
  IRewritedPeriodRepository,
  REWRITED_PERIOD_REPOSITORY,
} from '../../core/domain/ports/rewrited-period.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RewritedPeriodEntity])],
  providers: [
    RewritedPeriodMapper,
    {
      provide: REWRITED_PERIOD_REPOSITORY,
      useClass: TypeOrmRewritedPeriodRepository,
    },
  ],
  exports: [REWRITED_PERIOD_REPOSITORY],
})
export class RewritedPeriodPersistenceModule {}
