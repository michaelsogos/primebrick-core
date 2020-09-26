import { Module } from '@nestjs/common';
import { AdvancedLogger, SessionManagerModule, TenantManagerModule } from 'primebrick-sdk';
import { AuthModule } from '../Auth/auth.module';
import { DataAccessSecureController } from './dataaccess.secure.controller';
import { DataAccessService } from './dataaccess.service';

@Module({
    imports: [TenantManagerModule, AuthModule, SessionManagerModule],
    controllers: [DataAccessSecureController],
    providers: [DataAccessService, AdvancedLogger],
})
export class DataAccessModule {}
