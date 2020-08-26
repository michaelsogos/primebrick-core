import { Module } from '@nestjs/common';
import { TenantManagerModule } from 'primebrick-sdk';
import { AuthModule } from '../Auth/auth.module';
import { DataAccessSecureController } from './dataaccess.secure.controller';
import { DataAccessService } from './dataaccess.service';

@Module({
    imports: [TenantManagerModule, AuthModule],
    controllers: [DataAccessSecureController],
    providers: [DataAccessService],
})
export class DataAccessModule {}
