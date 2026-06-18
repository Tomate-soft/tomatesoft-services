import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresDbConfigOptions } from '../postgres-db.module';

export class PostgresDbConfig {
  static getConnectionStringUrl(options: PostgresDbConfigOptions): string {
    const { host, port, user, password, database } = options;

    const escapedUser = encodeURIComponent(user);
    const escapedPassword = encodeURIComponent(password);

    const postgres_url = `postgresql://${escapedUser}:${escapedPassword}@${host}:${port}/${database}`;

    return postgres_url;
  }

  static getConfig(options: PostgresDbConfigOptions): TypeOrmModuleOptions {
    if (options.connectionString) {
      return {
        type: 'postgres',
        url: options.connectionString,
        entities: options.entities ?? [],
        synchronize: true,
      };
    }

    return {
      type: 'postgres',
      url: this.getConnectionStringUrl(options),
      entities: options.entities ?? [],
      synchronize: true,
    };
  }
}
