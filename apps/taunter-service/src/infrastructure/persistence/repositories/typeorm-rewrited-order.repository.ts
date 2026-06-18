import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewritedOrder } from '../../../core/domain/entities/RewritedOrder.entity';
import { OrderId } from '../../../core/domain/vo/order-id.vo';
import { IRewritedOrderRepository } from '../../../core/domain/ports/rewrited-order.repository';
import { RewritedOrderEntity } from '../entities/rewrited-order.entity';
import { RewritedOrderMapper } from '../mappers/rewrited-order.mapper';

@Injectable()
export class TypeOrmRewritedOrderRepository implements IRewritedOrderRepository {
  constructor(
    @InjectRepository(RewritedOrderEntity)
    private readonly repository: Repository<RewritedOrderEntity>,
    private readonly mapper: RewritedOrderMapper,
  ) {}

  async save(order: RewritedOrder): Promise<RewritedOrder> {
    const entity = this.mapper.toPersistence(order);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async saveMany(orders: RewritedOrder[]): Promise<RewritedOrder[]> {
    const entities = orders.map((o) => this.mapper.toPersistence(o));
    const saved: RewritedOrderEntity[] = [];
    for (const entity of entities) {
      const result = await this.repository.save(entity);
      saved.push(result);
    }
    return saved.map((e) => this.mapper.toDomain(e));
  }

  async findById(id: string): Promise<RewritedOrder | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByOrderId(
    orderId: OrderId | string,
  ): Promise<RewritedOrder | null> {
    const id = orderId instanceof OrderId ? orderId.getValue() : orderId;
    const entity = await this.repository.findOneBy({ order_id: id });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<RewritedOrder[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
