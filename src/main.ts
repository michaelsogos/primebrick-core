import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { tenantExtractorMiddleware, GlobalExceptionsFilter } from 'primebrick-sdk';

global['appModuleName'] = 'core';

async function bootstrap() {
    //TODO: @mso -> DB Initialization in order to create dynamically DATABASE
    const app = await NestFactory.create(AppModule);
    app.use(tenantExtractorMiddleware);
    app.enableCors();
    app.useGlobalFilters(new GlobalExceptionsFilter());
    await app.listen(3000);
}

bootstrap();
