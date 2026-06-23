import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global/global.module';
import { BoundedModule } from './modules/bounded/bounded.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [GlobalModule, BoundedModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
