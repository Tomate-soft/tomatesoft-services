import { Module } from '@nestjs/common';
import { RewritedPeriodPersistenceModule } from './persistence/rewrited-period-persistence.module';

@Module({
  imports: [RewritedPeriodPersistenceModule],
  exports: [RewritedPeriodPersistenceModule],
})
export class RewritedPeriodModule {}
