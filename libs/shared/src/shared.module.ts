import { Module } from '@nestjs/common';
import { RabbitmqQueueModule } from './rabbitmq-queue/rabbitmq-queue.module';
import { PostgresDbModule } from './postgres-db/postgres-db.module';

@Module({
  imports: [RabbitmqQueueModule, PostgresDbModule],
})
export class SharedModule {}
