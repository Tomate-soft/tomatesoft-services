import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresDbConfigOptions } from '../postgres-db.module';

export class PostgresDbConfig {
  static getConnectionStringUrl(options: PostgresDbConfigOptions): string {
    const { host, port, user, password, database } = options;
    const postgres_url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    return postgres_url;
  }

  static getConfig(options: PostgresDbConfigOptions): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.getConnectionStringUrl(options),
      entities: [],
      synchronize: false,
    };
  }
}
