import { Entity, Id } from '@app/shared';

export class RewritedPeriod extends Entity<RewritedPeriod> {
  periodId!: string;
  reportId!: string;
  order_array: any;

  constructor() {
    super();
    this.id = Id.generate();
  }

  equalsTo(entity: RewritedPeriod): boolean {
    return this.id.getValue() === entity.id.getValue();
  }
}
