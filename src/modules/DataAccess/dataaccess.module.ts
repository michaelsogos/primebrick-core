import { Module } from '@nestjs/common';
import { LogManagerModule, ProcessorManagerModule, SessionManagerModule } from 'primebrick-sdk/modules';
import { AuthModule } from '../Auth/auth.module';
import { DataAccessSecureController } from './dataaccess.secure.controller';
import { DataAccessService } from './dataaccess.service';

@Module({
    imports: [AuthModule, SessionManagerModule, ProcessorManagerModule, LogManagerModule],
    controllers: [DataAccessSecureController],
    providers: [DataAccessService],
})
export class DataAccessModule {}
