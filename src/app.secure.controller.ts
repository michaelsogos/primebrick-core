import { Controller, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Migration } from 'typeorm';
import { AuthGuard } from 'primebrick-sdk';

@Controller('api/management')
@UseGuards(AuthGuard)
export class AppSecureController {
    //TODO: @mso -> Remove di controller in order to call core-brick service to run specific brick method (reponsability concern)
    constructor(private readonly appService: AppService) {}

    @Post('updatedb')
    async updateDatabase(): Promise<Migration[]> {
        return await this.appService.updateDatabaseSchema();
    }

    @Post('seeddb')
    async seedDatabase(): Promise<any[]> {
        return await this.appService.importDataInitData();
    }
}
