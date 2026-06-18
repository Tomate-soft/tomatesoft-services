import { Entity } from '@app/shared';

export class RewritedPeriod extends Entity<RewritedPeriod> {
  periodId!: string;
  order_array!: number[];

  constructor() {
    super();
  }

  equalsTo(entity: RewritedPeriod): boolean {
    return this.id.getValue() === entity.id.getValue();
  }
}
