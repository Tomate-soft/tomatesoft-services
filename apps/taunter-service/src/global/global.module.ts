import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDbModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresDbModule.register({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'taunter',
    }),
  ],
})
export class GlobalModule {}
