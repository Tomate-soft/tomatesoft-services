import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'rewrited_orders' })
export class RewritedOrderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  order_id: string;

  @Column({ name: 'period_id', type: 'uuid' })
  period_id: string;

  @Column({ name: 'code', type: 'varchar', length: 255 })
  code: string;

  @Column({ name: 'user_name', type: 'varchar', length: 255 })
  user_name: string;

  @Column({ name: 'user_employee_number', type: 'varchar', length: 255 })
  user_employee_number: string;

  @Column({ name: 'status', type: 'varchar', length: 100 })
  status: string;

  @Column({ name: 'order_detail', type: 'jsonb', nullable: true })
  order_detail: any;

  @Column({ name: 'payment_detail', type: 'jsonb', nullable: true })
  payment_detail: any;

  @Column({ name: 'table_detail', type: 'text', nullable: true })
  table_detail: string;

  @Column({ name: 'order_name', type: 'varchar', length: 255 })
  order_name: string;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'diner', type: 'int' })
  diner: number;
}
