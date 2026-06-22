import { MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoDbConfigOptions } from '../mongodb.module';

export class MongoDbConfig {
  static getConnectionStringUrl(options: MongoDbConfigOptions): string {
    const host = options.host!;
    const port = options.port!;
    const user = options.user!;
    const password = options.password!;
    const database = options.database!;

    const escapedUser = encodeURIComponent(user);
    const escapedPassword = encodeURIComponent(password);

    let mongo_url = `mongodb://${escapedUser}:${escapedPassword}@${host}:${port}/${database}`;

    if (options.authSource) {
      mongo_url += `?authSource=${options.authSource}`;
    }

    return mongo_url;
  }

  static getConfig(options: MongoDbConfigOptions): MongooseModuleOptions {
    if (options.connectionString) {
      return {
        uri: options.connectionString,
      };
    }

    return {
      uri: this.getConnectionStringUrl(options),
    };
  }
}
