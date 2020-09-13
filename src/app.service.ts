import { Injectable } from '@nestjs/common';
import { Migration } from 'typeorm';
import { TenantManagerService } from 'primebrick-sdk';

@Injectable()
export class AppService {
    constructor(private readonly tenantManagerService: TenantManagerService) {}

    async updateDatabaseSchema(tenantAlias: string): Promise<Migration[]> {
        const result = await this.tenantManagerService.updateTenantDatabaseSchema(tenantAlias);
        return result;
    }

    async importDataInitData(tenantAlias: string): Promise<any[]> {
        const result = await this.tenantManagerService.importTenantDatabaseData(tenantAlias);
        return result;
    }
}
