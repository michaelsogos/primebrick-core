import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { MetadataModule } from './modules/MetaData/metadata.module';
import { ActionModule } from './modules/Action/action.module';
import { TenantManagerModule, PrimeBrickModule, SessionManagerModule, SessionManagerMiddleware, AudibleEntitySubscriber } from 'primebrick-sdk';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/Auth/auth.module';
import { DataAccessModule } from './modules/DataAccess/dataaccess.module';
import { AppSecureController } from './app.secure.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeormconfig.service';
import { loadConfig } from './config/primebrick.config';

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
        MetadataModule,
        ActionModule,
        TenantManagerModule,
        AuthModule,
        DataAccessModule,
        SessionManagerModule,
    ],
    controllers: [AppSecureController],
    providers: [ConfigService, AppService, AudibleEntitySubscriber],
})
export class AppModule extends PrimeBrickModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(SessionManagerMiddleware).forRoutes('*');
    }
}
