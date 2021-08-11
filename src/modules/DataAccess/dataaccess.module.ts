import { Module } from '@nestjs/common';
import { AdvancedLogger } from 'primebrick-sdk/core';
import { ProcessorManagerModule, SessionManagerModule } from 'primebrick-sdk/modules';
import { AuthModule } from '../Auth/auth.module';
import { DataAccessSecureController } from './dataaccess.secure.controller';
import { DataAccessService } from './dataaccess.service';

@Module({
    imports: [AuthModule, SessionManagerModule, ProcessorManagerModule],
    controllers: [DataAccessSecureController],
    providers: [DataAccessService, AdvancedLogger],
})
export class DataAccessModule {}
