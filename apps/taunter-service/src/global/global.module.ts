import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDbModule, MongoDbModule } from '@app/shared';
import { RewritedOrderEntity } from '../infrastructure/persistence/entities/rewrited-order.entity';
import { RewritedPeriodEntity } from '../infrastructure/persistence/entities/rewrited-period.entity';

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'taunter',
  entities: [RewritedOrderEntity, RewritedPeriodEntity],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresDbModule.register(dbConfig),
    MongoDbModule.register({
      connectionString: process.env.MONGO_CONNECTION_STRING || '',
    }),
  ],
})
export class GlobalModule {}
