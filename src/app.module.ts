import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { ActionModule } from './modules/Action/action.module';
import {
    TenantManagerModule,
    PrimeBrickModule,
    SessionManagerModule,
    SessionManagerMiddleware,
    AudibleEntitySubscriber,
    AdvancedLogger,
    TypeOrmConfigService,
    loadConfig,
    TenantManagerService,
    ProcessorManagerModule,
} from 'primebrick-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { DataAccessModule } from './modules/DataAccess/dataaccess.module';
import { AppSecureController } from './app.secure.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppScheduler } from './app.scheduler';
import { AppController } from './app.controller';
import { DataAccessService } from './modules/DataAccess/dataaccess.service';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.app.config.env', '.logger.config.env', '.db.config.env', '.primebrick.config.env', '.env'],
            load: [loadConfig],
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
    ],
    controllers: [AppSecureController, AppController],
    providers: [ConfigService, AppService, AudibleEntitySubscriber, AppScheduler, AdvancedLogger, DataAccessService],
})
export class AppModule implements NestModule {
    constructor(readonly tenantManagerService: TenantManagerService, readonly logger: AdvancedLogger) {
        this.tenantManagerService.loadAllTenantsInMemory(true);
        logger.setContext(process.brickName);
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(SessionManagerMiddleware).forRoutes('*');
    }
}
