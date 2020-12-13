import { Module } from '@nestjs/common';
import { AdvancedLogger, ProcessorManagerModule, SessionManagerModule, TenantManagerModule } from 'primebrick-sdk';
import { AuthModule } from '../Auth/auth.module';
import { DataAccessSecureController } from './dataaccess.secure.controller';
import { DataAccessService } from './dataaccess.service';

@Module({
    imports: [AuthModule, SessionManagerModule, ProcessorManagerModule],
    controllers: [DataAccessSecureController],
    providers: [DataAccessService, AdvancedLogger],
})
export class DataAccessModule {}
