import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDbModule, MongoDbModule, RedisDbModule } from '@app/shared';
import { RewritedOrderEntity } from '../infrastructure/persistence/postgres/entities/rewrited-order.entity';
import { RewritedPeriodEntity } from '../infrastructure/persistence/postgres/entities/rewrited-period.entity';

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [RewritedOrderEntity, RewritedPeriodEntity],
};

const mongoConfig = {
  connectionString: process.env.MONGO_CONNECTION_STRING,
  host: process.env.MONGO_HOST || 'localhost',
  port: Number(process.env.MONGO_PORT) || 27017,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DB,
  authSource: process.env.MONGO_AUTH_SOURCE,
};

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresDbModule.register(dbConfig),
    MongoDbModule.register(mongoConfig),
    RedisDbModule.register(redisConfig),
  ],
})
export class GlobalModule {}
