import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresDbConfigOptions } from '../postgres-db.module';

export class PostgresDbConfig {
  static getConnectionStringUrl(options: PostgresDbConfigOptions): string {
    const { host, port, user, password, database } = options;

    const escapedUser = encodeURIComponent(user);
    const escapedPassword = encodeURIComponent(password);

    const postgres_url = `postgresql://${escapedUser}:${escapedPassword}@${host}:${port}/${database}`;

    console.log('[PostgresDbConfig] Connection URL:', postgres_url);
    return postgres_url;
  }

  static getConfig(options: PostgresDbConfigOptions): TypeOrmModuleOptions {
    if (options.connectionString) {
      console.log(
        '[PostgresDbConfig] Using connection string:',
        options.connectionString,
      );
      return {
        type: 'postgres',
        url: options.connectionString,
        entities: [],
        synchronize: false,
      };
    }

    return {
      type: 'postgres',
      url: this.getConnectionStringUrl(options),
      entities: [],
      synchronize: false,
    };
  }
}
