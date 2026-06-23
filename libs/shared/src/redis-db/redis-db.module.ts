import { DynamicModule } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisDbConfig } from './config/redis-db.config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export interface RedisDbConfigOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  connectionString?: string;
}

export class RedisDbModule {
  static register(options: RedisDbConfigOptions): DynamicModule {
    const redis_config = RedisDbConfig.getConfig(options);
    return {
      module: RedisDbModule,
      global: true,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: () => {
            const client = new Redis(redis_config);
            return client;
          },
        },
      ],
      exports: [REDIS_CLIENT],
    };
  }
}
