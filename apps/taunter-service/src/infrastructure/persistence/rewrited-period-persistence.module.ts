import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewritedPeriodEntity } from './postgres/entities/rewrited-period.entity';
import { REWRITED_PERIOD_REPOSITORY } from '../../core/domain/ports/rewrited-period.repository';
import { RewritedPeriodMapper } from './postgres/mappers/rewrited-period.mapper';
import { TypeOrmRewritedPeriodRepository } from './postgres/repositories/typeorm-rewrited-period.repository';

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
