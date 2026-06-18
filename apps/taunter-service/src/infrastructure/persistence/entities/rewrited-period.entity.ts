import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'rewrited_periods' })
export class RewritedPeriodEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'period_id', type: 'varchar', length: 255 })
  period_id: string;

  @Column({ name: 'report_id', type: 'varchar', length: 255, nullable: true })
  report_id: string;

  @Column({ name: 'order_ids', type: 'jsonb', nullable: true })
  order_ids: any;
}
