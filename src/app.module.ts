import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { ActionModule } from './modules/Action/action.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { DataAccessModule } from './modules/DataAccess/dataaccess.module';
import { AppSecureController } from './app.secure.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppScheduler } from './app.scheduler';
import { AppController } from './app.controller';
import { DataAccessService } from './modules/DataAccess/dataaccess.service';
import { ConfigLoader, TypeOrmConfigService } from 'primebrick-sdk/core';
import {
    LogManagerModule,
    LogManagerService,
    ProcessorManagerModule,
    SessionManagerModule,
    TenantManagerModule,
    TenantManagerService,
} from 'primebrick-sdk/modules';
import { AudibleEntitySubscriber, SessionManagerMiddleware } from 'primebrick-sdk/nest';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.app.config.env', '.logger.config.env', '.db.config.env', '.primebrick.config.env', '.env'],
            load: [ConfigLoader],
        }),
        TypeOrmModule.forRootAsync({
            name: 'primebrick_coordinator',
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService,
        }),
        ActionModule,
        TenantManagerModule,
        AuthModule,
        DataAccessModule,
        SessionManagerModule,
        ProcessorManagerModule,
        LogManagerModule,
    ],
    controllers: [AppSecureController, AppController],
    providers: [ConfigService, AppService, AudibleEntitySubscriber, AppScheduler, DataAccessService],
})
export class AppModule implements NestModule {
    constructor(readonly tenantManagerService: TenantManagerService, readonly logger: LogManagerService) {
        this.tenantManagerService.loadAllTenantsInMemory(true);
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(SessionManagerMiddleware).forRoutes('*');
    }
}
