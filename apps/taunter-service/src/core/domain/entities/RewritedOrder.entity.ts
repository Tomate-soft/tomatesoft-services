import { Entity } from '@app/shared';

export class RewritedOrder extends Entity<RewritedOrder> {
  order_id!: string;
  code!: string;
  seller_id!: string;
  user_name!: string;
  user_employee_number!: string;
  status!: string;
  order_detail!: any;
  payment_detail!: any;
  table_detail!: string;
  order_name!: string;
  comments!: string;
  diner!: number;

  constructor() {
    super();
  }

  static create;

  equalsTo(entity: RewritedOrder): boolean {
    return this.id.getValue() === entity.id.getValue();
  }
  orderId!: string;
}
