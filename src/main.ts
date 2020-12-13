import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { tenantExtractorMiddleware, GlobalExceptionsFilter, AdvancedLogger, AppConfig } from 'primebrick-sdk';
import { ConfigService } from '@nestjs/config';
import * as timeout from 'connect-timeout';

global['appModuleName'] = 'core';

async function bootstrap() {
    //TODO: @mso -> DB Initialization in order to create dynamically DATABASE
    const app = await NestFactory.create(AppModule, {
        logger: new AdvancedLogger(global['appModuleName'], true),
    });
    app.use(tenantExtractorMiddleware);
    app.enableCors(); //TODO: @michaelsogos -> Add proper CORS config to not open to everyone (in case of external client the suggestion is to identify an HTTP HEADER to be assigned)
    app.useGlobalFilters(new GlobalExceptionsFilter());

    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');
    app.use(timeout(appConfig.requestTimeout));
    await app.listen(appConfig.port);
}

bootstrap();
