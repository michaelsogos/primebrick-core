import { Module } from '@nestjs/common';
import { MetadataSecureController } from './metadata.secure.controller';
import { MetadataService } from './metadata.service';
import { AdvancedLogger, SessionManagerModule, TenantManagerModule } from 'primebrick-sdk';
import { AuthModule } from '../Auth/auth.module';
import { MetadataController } from './metadata.controller';

@Module({
    imports: [TenantManagerModule, AuthModule, SessionManagerModule],
    controllers: [MetadataController, MetadataSecureController],
    providers: [MetadataService, AdvancedLogger],
})
export class MetadataModule {}
