import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { TenantManagerModule } from 'primebrick-sdk';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [TenantManagerModule, AuthModule],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
