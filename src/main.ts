import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MainBoot } from 'primebrick-sdk/decorators';
import { GlobalExceptionsFilter } from 'primebrick-sdk/nest';
import { AppConfig, PrimebrickConfig } from 'primebrick-sdk/models';

@MainBoot('api')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main {
    static async start() {
        //This is mandatory to be done in this way else AppModule will load sdk DataAccess controller too early, when process.brickName is not defined yet
        const appModule = (await import('./app.module')).AppModule;
        const logManagerService = (await import('primebrick-sdk/modules')).LogManagerService;

        //TODO: @mso -> DB Initialization in order to create dynamically DATABASE
        const app = await NestFactory.create(appModule, {
            bufferLogs: true,
        });

        const logger = app.get(logManagerService);

        app.useLogger(logger);
        app.enableCors(); //TODO: @michaelsogos -> Add proper CORS config to not open to everyone (in case of external client the suggestion is to identify an HTTP HEADER to be assigned)
        app.useGlobalFilters(new GlobalExceptionsFilter());

        const configService = app.get<ConfigService<PrimebrickConfig>>(ConfigService);
        const appConfig = configService.get<AppConfig>('app');
        await app.listen(appConfig.port).then(() => logger.info('Api gateway listening'));
    }
}
