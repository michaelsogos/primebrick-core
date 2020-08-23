import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetaView } from './entities/metaView.entity';
import { Tenant, AuthGuard, Context, ContextPayload } from 'primebrick-sdk';
import { MetaMenuItem } from './entities/MetaMenuItem.entity';

@Controller('api/meta')
@UseGuards(AuthGuard)
export class MetadataSecureController {
    constructor(private readonly metadataService: MetadataService) {}

    @Get('views')
    async getAllView(@Tenant() tenantAlias: string): Promise<MetaView[]> {
        return this.metadataService.getAllViews(tenantAlias);
    }

    @Get('view')
    async getView(@Context() context: ContextPayload, @Query('viewName') viewName: string): Promise<MetaView> {
        return await this.metadataService.getView(context, viewName);
    }

    // @Post('view')
    // async postMetaView(@Tenant() tenantAlias: string): Promise<void> {
    //     await this.metadataService.saveNewMetaView(tenantAlias);
    // }

    @Get('info')
    async getAppInfo(): Promise<any> {
        //TODO: @mso -> Collect those information from DB or external JSON (not from package json in order to be customizable from ISV)
        return {
            description: 'PrimeBrick',
            version: '0.1.0',
            author: 'GuruStudioWeb',
            copyright: 'MIT',
            supportURL: 'http://primebrick.io',
        };
    }

    @Get('menu')
    async getAppMenu(@Context() context: ContextPayload): Promise<MetaMenuItem[]> {
        return await this.metadataService.getMenuItems(context);
    }
}
