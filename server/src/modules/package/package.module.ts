import { Module } from '@nestjs/common';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageEntity } from './package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageEntity])],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
