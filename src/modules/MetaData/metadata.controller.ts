import { Controller, Get, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { Context, ContextPayload } from 'primebrick-sdk';
import { MetaTranslation } from './entities/MetaTranslation.entity';

@Controller('api/meta')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}

    @Get('translations')
    async getAppTranslations(
        @Context({ excludeUserProfile: true }) context: ContextPayload,
        @Query('group') group: string,
    ): Promise<MetaTranslation[]> {
        return await this.metadataService.getTranslations(group, context);
    }
}
