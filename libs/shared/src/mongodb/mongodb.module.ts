import { MongooseModule } from '@nestjs/mongoose';
import { DynamicModule } from '@nestjs/common';
import { MongoDbConfig } from './config/mongodb.config';

export interface MongoDbConfigOptions {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  connectionString?: string;
}

export class MongoDbModule {
  static register(options: MongoDbConfigOptions): DynamicModule {
    const db_config = MongoDbConfig.getConfig(options);
    return {
      module: MongoDbModule,
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => db_config,
        }),
      ],
      providers: [],
      exports: [],
    };
  }
}
