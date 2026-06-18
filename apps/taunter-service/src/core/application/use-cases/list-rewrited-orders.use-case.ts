import { Inject, Injectable } from '@nestjs/common';
import {
  IRewritedOrderRepository,
  REWRITED_ORDER_REPOSITORY,
} from '../../domain/ports/rewrited-order.repository';
import { RewritedOrder } from '../../domain/entities/RewritedOrder.entity';

@Injectable()
export class ListRewritedOrdersUseCase {
  constructor(
    @Inject(REWRITED_ORDER_REPOSITORY)
    private readonly repository: IRewritedOrderRepository,
  ) {}

  async execute(): Promise<RewritedOrder[]> {
    return this.repository.findAll();
  }
}
