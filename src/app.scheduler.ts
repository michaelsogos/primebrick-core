import { Injectable } from '@nestjs/common';
import { Interval, NestSchedule } from 'nest-schedule';
import { AdvancedLogger, TenantManagerService } from 'primebrick-sdk';

@Injectable()
export class AppScheduler extends NestSchedule {
    constructor(readonly tenantManagerService: TenantManagerService, private readonly logger: AdvancedLogger) {
        super();
    }

    @Interval(parseInt(process.env.SCHEDULE_TENANTS_LOADER, 10) || 300000)
    async tenantsLoader(): Promise<boolean> {
        this.logger.debug('Refreshing tenants configurations');
        this.tenantManagerService.loadAllTenantsInMemory(true);

        return false;
    }
}
