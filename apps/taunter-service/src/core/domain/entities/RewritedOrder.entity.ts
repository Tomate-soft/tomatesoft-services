import { Entity, Id } from '@app/shared';
import { OrderId } from '../vo/order-id.vo';
import { RewritedOrderBuilder } from '../builder/RewritedOrder.builder';

export interface RewriteOrderDto {
  id: string;
  order_id: string;
  code: string;
  user_name: string;
  user_employee_number: string;
  status: string;
  order_detail: any;
  payment_detail: any;
  table_detail: string;
  order_name: string;
  comments: string;
  diner: number;
}

export class RewritedOrder extends Entity<RewritedOrder> {
  orderId!: OrderId;
  code!: string;
  userName!: string;
  userEmployeeNumber!: string;
  status!: string;
  orderDetail!: any;
  paymentDetail!: any;
  tableDetail!: string;
  orderName!: string;
  comments!: string;
  diner!: number;

  constructor() {
    super();
    this.id = Id.generate();
  }

  static create(props: RewriteOrderDto): RewritedOrder {
    const {
      order_id,
      code,
      user_name,
      user_employee_number,
      status,
      order_detail,
      payment_detail,
      table_detail,
      order_name,
      comments,
      diner,
    } = props;

    const builder = new RewritedOrderBuilder()
      .setOrderId(order_id ?? OrderId.generate())
      .setCode(code)
      .setUserName(user_name)
      .setUserEmployeeNumber(user_employee_number)
      .setStatus(status)
      .setOrderDetail(order_detail)
      .setPaymentDetail(payment_detail)
      .setTableDetail(table_detail)
      .setOrderName(order_name)
      .setComments(comments)
      .setDiner(diner);
    return builder.build();
  }

  equalsTo(entity: RewritedOrder): boolean {
    return this.id.getValue() === entity.id.getValue();
  }

  toJSON(): RewriteOrderDto {
    return {
      id: this.id.getValue(),
      order_id: this.orderId.getValue(),
      code: this.code,
      user_name: this.userName,
      user_employee_number: this.userEmployeeNumber,
      status: this.status,
      order_detail: this.orderDetail,
      payment_detail: this.paymentDetail,
      table_detail: this.tableDetail,
      order_name: this.orderName,
      comments: this.comments,
      diner: this.diner,
    };
  }
}
