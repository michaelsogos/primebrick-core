import { Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Migration } from 'typeorm';
import { Tenant, AuthGuard } from 'primebrick-sdk';

@Controller('api/management')
@UseGuards(AuthGuard)
export class AppSecureController {
    constructor(private readonly appService: AppService) {}

    @Post('updatedb')
    async updateDatabase(@Tenant() tenantAlias: string): Promise<Migration[]> {
        return await this.appService.updateDatabaseSchema(tenantAlias);
    }

    @Post('seeddb')
    async seedDatabase(@Tenant() tenantAlias: string): Promise<any[]> {
        return await this.appService.importDataInitData(tenantAlias);
    }
}
