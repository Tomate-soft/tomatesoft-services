import { Injectable } from '@nestjs/common';
import { Id } from '@app/shared';
import { RewritedOrder } from '../../../core/domain/entities/RewritedOrder.entity';
import { OrderId } from '../../../core/domain/vo/order-id.vo';
import { RewritedOrderEntity } from '../entities/rewrited-order.entity';

@Injectable()
export class RewritedOrderMapper {
  toDomain(entity: RewritedOrderEntity): RewritedOrder {
    const order = new RewritedOrder();
    order.id = new Id(entity.id);
    order.orderId = OrderId.create(entity.order_id);
    order.code = entity.code;
    order.userName = entity.user_name;
    order.userEmployeeNumber = entity.user_employee_number;
    order.status = entity.status;
    order.orderDetail = entity.order_detail;
    order.paymentDetail = entity.payment_detail;
    order.tableDetail = entity.table_detail;
    order.orderName = entity.order_name;
    order.comments = entity.comments;
    order.diner = entity.diner;
    return order;
  }

  toPersistence(domain: RewritedOrder): RewritedOrderEntity {
    const entity = new RewritedOrderEntity();
    entity.id = domain.id.getValue();
    entity.order_id = domain.orderId.getValue();
    entity.code = domain.code;
    entity.user_name = domain.userName;
    entity.user_employee_number = domain.userEmployeeNumber;
    entity.status = domain.status;
    entity.order_detail = domain.orderDetail;
    entity.payment_detail = domain.paymentDetail;
    entity.table_detail = domain.tableDetail;
    entity.order_name = domain.orderName;
    entity.comments = domain.comments;
    entity.diner = domain.diner;
    return entity;
  }
}
