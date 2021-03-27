import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
} from 'primebrick-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { DataAccessModule } from './modules/DataAccess/dataaccess.module';
import { AppSecureController } from './app.secure.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppScheduler } from './app.scheduler';

@Module({
    imports: [
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
    ],
    controllers: [AppSecureController],
    providers: [ConfigService, AppService, AudibleEntitySubscriber, AppScheduler, AdvancedLogger],
})
export class AppModule extends PrimeBrickModule implements NestModule {
    //TODO: @mso -> Remove extending PrimeBrickModule in order to not run SCHEMA UPDATE and DATA IMPORT, move everything in core-brick and commons-core
    constructor(readonly tenantManagerService: TenantManagerService, readonly logger: AdvancedLogger) {
        super(tenantManagerService, logger);
        logger.setContext(process.brickName);
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(SessionManagerMiddleware).forRoutes('*');
    }
}
