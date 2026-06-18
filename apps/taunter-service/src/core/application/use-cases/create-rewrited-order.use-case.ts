import { Inject, Injectable } from '@nestjs/common';
import {
  IRewritedOrderRepository,
  REWRITED_ORDER_REPOSITORY,
} from '../../domain/ports/rewrited-order.repository';
import { RewritedOrder } from '../../domain/entities/RewritedOrder.entity';
import { RewriteOrderDto } from '../../domain/entities/RewritedOrder.entity';

@Injectable()
export class CreateRewritedOrderUseCase {
  constructor(
    @Inject(REWRITED_ORDER_REPOSITORY)
    private readonly repository: IRewritedOrderRepository,
  ) {}

  async execute(dto: RewriteOrderDto): Promise<RewritedOrder> {
    const order = RewritedOrder.create(dto);
    return this.repository.save(order);
  }
}
