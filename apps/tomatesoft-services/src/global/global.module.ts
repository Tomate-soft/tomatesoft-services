import { MongoDbModule } from '@app/shared/mongodb/mongodb.module';
import { Module } from '@nestjs/common';

const mongoConfig = {
  connectionString: process.env.MONGO_CONNECTION_STRING,
  host: process.env.MONGO_HOST || 'localhost',
  port: Number(process.env.MONGO_PORT) || 27017,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DB,
  authSource: process.env.MONGO_AUTH_SOURCE,
};

@Module({
  imports: [MongoDbModule.register(mongoConfig)],
})
export class GlobalModule {}
