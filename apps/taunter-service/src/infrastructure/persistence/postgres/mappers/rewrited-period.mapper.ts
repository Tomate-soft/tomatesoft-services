import { Injectable } from '@nestjs/common';
import { Id } from '@app/shared';
import { RewritedPeriodEntity } from '../entities/rewrited-period.entity';
import { RewritedPeriod } from 'apps/taunter-service/src/core/domain/entities/RewritedPeriod.aggregate';

@Injectable()
export class RewritedPeriodMapper {
  toDomain(entity: RewritedPeriodEntity): RewritedPeriod {
    const period = new RewritedPeriod();
    period.id = new Id(entity.id);
    period.periodId = entity.period_id;
    period.reportId = entity.report_id;
    if (entity.order_ids) {
      period.order_array = entity.order_ids;
    }
    return period;
  }

  toPersistence(domain: RewritedPeriod): RewritedPeriodEntity {
    const entity = new RewritedPeriodEntity();
    entity.id = domain.id.getValue();
    entity.period_id = domain.periodId;
    entity.report_id = domain.reportId;
    entity.order_ids = domain.order_array;
    return entity;
  }
}
