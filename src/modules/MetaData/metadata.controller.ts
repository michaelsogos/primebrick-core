import { Controller, Get, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetaTranslation } from './entities/MetaTranslation.entity';

@Controller('api/meta')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}

    @Get('translations')
    async getAppTranslations(@Query('group') group: string): Promise<MetaTranslation[]> {
        return await this.metadataService.getTranslations(group);
    }
}
