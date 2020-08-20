import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Migration } from 'typeorm';
import { Tenant, AuthGuard } from 'primebrick-sdk';

@Controller('api/management')
//@UseGuards(AuthGuard)
//TODO: @mso -> Those methods cannot be unprotected. Because the authentication need update from database we have to make a kind of CLI command to at least run migration for specific cases
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('updatedb')
    async updateDatabase(@Tenant() tenantAlias: string): Promise<Migration[]> {
        return await this.appService.runMigrations(tenantAlias);
    }

    @Post('seeddb')
    async seedDatabase(@Tenant() tenantAlias: string, @Body('module') moduleName: string): Promise<any[]> {
        //TODO: @mso -> The promise sshould return a typed array of seeded files; like above Migration[]

        return await this.appService.importCsv(tenantAlias, moduleName);
    }
}
