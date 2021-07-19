import { Module } from '@nestjs/common';
import { AdvancedLogger, ProcessorManagerModule, ProcessorManagerService, TenantManagerModule } from 'primebrick-sdk';
import { AuthController } from './auth.controller';

@Module({
    imports: [TenantManagerModule, ProcessorManagerModule],
    controllers: [AuthController],
    providers: [ProcessorManagerService, AdvancedLogger],
    exports: [],
})
export class AuthModule {}
