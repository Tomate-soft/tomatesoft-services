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

    const mongo_url = `mongodb://${escapedUser}:${escapedPassword}@${host}:${port}/${database}`;

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
