import { RedisDbConfigOptions } from '../redis-db.module';
import { RedisOptions } from 'ioredis';

export class RedisDbConfig {
  static getConnectionStringUrl(options: RedisDbConfigOptions): string {
    const host = options.host!;
    const port = options.port!;
    const password = options.password;
    const db = options.db;

    let redis_url = `redis://`;

    if (password) {
      const escapedPassword = encodeURIComponent(password);
      redis_url += `:${escapedPassword}@`;
    }

    redis_url += `${host}:${port}`;

    if (db !== undefined) {
      redis_url += `/${db}`;
    }

    return redis_url;
  }

  static getConfig(options: RedisDbConfigOptions): RedisOptions {
    if (options.connectionString) {
      return {
        url: options.connectionString,
      };
    }

    return {
      url: this.getConnectionStringUrl(options),
    };
  }
}
