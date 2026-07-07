import { Id } from '@app/shared';
import { ValidationException } from '@app/shared/common/exceptions/validation-exception';
import { RewritedOrder } from '../entities/RewritedOrder.entity';
import { OrderId } from '../vo/order-id.vo';

export class RewritedOrderBuilder {
  private __rewritedOrder: RewritedOrder = new RewritedOrder();

  // Guard rails / Helper privado para centralizar la validación fail-fast
  #__ensureIsValid(fieldName: string, value: any): void {
    if (value === undefined || value === null || value === '') {
      throw new ValidationException(`${fieldName} is required`);
    }
  }

  setOrderId(orderId: OrderId | string): RewritedOrderBuilder {
    this.#__ensureIsValid('OrderId', orderId);
    this.__rewritedOrder.orderId =
      orderId instanceof OrderId ? orderId : new OrderId(orderId);
    return this;
  }

  setPeriodId(periodId: string): RewritedOrderBuilder {
    this.#__ensureIsValid('PeriodId', periodId);
    this.__rewritedOrder.periodId = periodId;
    return this;
  }

  setCode(code: string): RewritedOrderBuilder {
    this.#__ensureIsValid('Code', code);
    this.__rewritedOrder.code = code;
    return this;
  }

  setUserName(userName: string): RewritedOrderBuilder {
    this.#__ensureIsValid('UserName', userName);
    this.__rewritedOrder.userName = userName;
    return this;
  }

  setUserEmployeeNumber(userEmployeeNumber: string): RewritedOrderBuilder {
    this.#__ensureIsValid('UserEmployeeNumber', userEmployeeNumber);
    this.__rewritedOrder.userEmployeeNumber = userEmployeeNumber;
    return this;
  }

  setStatus(status: string): RewritedOrderBuilder {
    this.#__ensureIsValid('Status', status);
    this.__rewritedOrder.status = status;
    return this;
  }

  setOrderDetail(orderDetail: any): RewritedOrderBuilder {
    this.#__ensureIsValid('OrderDetail', orderDetail);
    this.__rewritedOrder.orderDetail = orderDetail;
    return this;
  }

  setPaymentDetail(paymentDetail: any): RewritedOrderBuilder {
    this.#__ensureIsValid('PaymentDetail', paymentDetail);
    this.__rewritedOrder.paymentDetail = paymentDetail;
    return this;
  }

  setTableDetail(tableDetail: string): RewritedOrderBuilder {
    this.#__ensureIsValid('TableDetail', tableDetail);
    this.__rewritedOrder.tableDetail = tableDetail;
    return this;
  }

  setOrderName(orderName: string): RewritedOrderBuilder {
    this.#__ensureIsValid('OrderName', orderName);
    this.__rewritedOrder.orderName = orderName;
    return this;
  }

  setComments(comments: string): RewritedOrderBuilder {
    this.#__ensureIsValid('Comments', comments);
    this.__rewritedOrder.comments = comments;
    return this;
  }

  setDiner(diner: number): RewritedOrderBuilder {
    this.#__ensureIsValid('Diner', diner);
    this.__rewritedOrder.diner = diner;
    return this;
  }

  setCreatedAt(createdAt?: Date): RewritedOrderBuilder {
    this.__rewritedOrder.createdAt = createdAt ?? new Date();
    return this;
  }

  setUpdatedAt(updatedAt?: Date): RewritedOrderBuilder {
    this.__rewritedOrder.updatedAt = updatedAt ?? new Date();
    return this;
  }

  build(): RewritedOrder {
    // La asignación de ID sigue aquí porque es un comportamiento por defecto, no una validación del cliente
    if (!this.__rewritedOrder.id) this.__rewritedOrder.id = Id.generate();

    return this.__rewritedOrder;
  }
}
