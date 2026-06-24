import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { EntitySchema } from 'typeorm';
import { PostgresDbConfig } from './config/postres-db.config';

type EntityClass = Function | EntitySchema;

export interface PostgresDbConfigOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionString?: string;
  entities?: EntityClass[];
}

export class PostgresDbModule {
  static register(options: PostgresDbConfigOptions): DynamicModule {
    const db_config = PostgresDbConfig.getConfig(options);
    return {
      module: PostgresDbModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => db_config,
        }),
      ],
      providers: [],
      exports: [],
    };
  }
}
