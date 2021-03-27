import { Module } from '@nestjs/common';
import { AdvancedLogger, TenantManagerModule } from 'primebrick-sdk';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [TenantManagerModule],
    controllers: [AuthController],
    providers: [AuthService, AdvancedLogger],
    exports: [],
})
export class AuthModule {}
