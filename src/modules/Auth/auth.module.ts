import { Module } from '@nestjs/common';
import { TenantManagerModule } from 'primebrick-sdk';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TenantManagerModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
