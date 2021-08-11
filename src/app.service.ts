import { Injectable } from '@nestjs/common';
import { Migration } from 'typeorm';
import { TenantManagerService } from 'primebrick-sdk/modules';

@Injectable()
export class AppService {
    constructor(private readonly tenantManagerService: TenantManagerService) {}

    async updateDatabaseSchema(): Promise<Migration[]> {
        const result = await this.tenantManagerService.updateTenantDatabaseSchema();
        return result;
    }

    async importDataInitData(): Promise<any[]> {
        const result = await this.tenantManagerService.importTenantDatabaseData();
        return result;
    }
}
