import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MetadataModule } from './modules/MetaData/metadata.module';
import { ActionModule } from './modules/Action/action.module';
import { CoordinatorConnectionConfig } from './db.config';
import { TenantManagerModule, PrimeBrickModule } from 'primebrick-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { DataAccessModule } from './modules/DataAccess/dataaccess.module';
import { AppSecureController } from './app.secure.controller';

@Module({
    imports: [TypeOrmModule.forRoot(CoordinatorConnectionConfig), MetadataModule, ActionModule, TenantManagerModule, AuthModule, DataAccessModule],
    controllers: [AppSecureController],
    providers: [AppService],
})
export class AppModule extends PrimeBrickModule {}
