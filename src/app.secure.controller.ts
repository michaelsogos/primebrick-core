import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Migration } from 'typeorm';
import { AppManifest, AuthGuard, GlobalRpcAction, ProcessorManagerService } from 'primebrick-sdk';

@Controller('api')
@UseGuards(AuthGuard)
export class AppSecureController {
    //TODO: @mso -> Remove di controller in order to call core-brick service to run specific brick method (reponsability concern)
    constructor(private readonly appService: AppService, private readonly processorManagerService: ProcessorManagerService) {}

    @Post('management/updatedb')
    async updateDatabase(): Promise<Migration[]> {
        return await this.appService.updateDatabaseSchema();
    }

    @Post('management/seeddb')
    async seedDatabase(): Promise<any[]> {
        return await this.appService.importDataInitData();
    }

    @Get('meta/info')
    async getAppInfo(): Promise<AppManifest> {
        const response = await this.processorManagerService.sendMessage<null, AppManifest>(GlobalRpcAction.GET_APP_MANIFEST, null);
        return response.data;
    }

    @Get('meta/menu')
    async getAppMenu(): Promise<any[]> {
        const response = await this.processorManagerService.sendMessage<null, any[]>(GlobalRpcAction.GET_SIDEMENU, null);
        return response.data;
    }
}
