import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { LogManagerService, TenantManagerService } from 'primebrick-sdk/modules';

@Injectable()
export class AppScheduler {
    constructor(readonly tenantManagerService: TenantManagerService, private readonly logger: LogManagerService) {}

    @Interval(parseInt(process.env.SCHEDULE_TENANTS_LOADER, 10) || 300000)
    async tenantsLoader(): Promise<boolean> {
        this.logger.debug('Refreshing tenants configurations');
        this.tenantManagerService.loadAllTenantsInMemory(true);

        return false;
    }
}
