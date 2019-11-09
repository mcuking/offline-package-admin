import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DBModule } from './db.module';
import { PackageModule } from './modules/package/package.module';

@Module({
  imports: [DBModule, PackageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
