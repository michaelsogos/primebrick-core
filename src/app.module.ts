import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetadataModule } from './modules/MetaData/metadata.module';
import { ActionModule } from './modules/Action/action.module';
import { CoordinatorConnectionConfig } from './db.config';
import { TenantManagerModule, PrimeBrickModule } from 'primebrick-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(CoordinatorConnectionConfig), MetadataModule, ActionModule, TenantManagerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule extends PrimeBrickModule {}
