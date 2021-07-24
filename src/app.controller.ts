import { Controller, Get, Query } from '@nestjs/common';
import { GlobalRpcAction, ProcessorManagerService } from 'primebrick-sdk';

@Controller('api')
export class AppController {
    constructor(private readonly processorManagerService: ProcessorManagerService) {}

    @Get('meta/translations')
    async getTranslations(@Query('group') group: string): Promise<any[]> {
        let response = await this.processorManagerService.sendMessage<{ group: string; languageCode?: string }, any[]>(
            GlobalRpcAction.GET_TRANSLATION,
            { group },
        );
        if (response.data.length <= 0)
            response = await this.processorManagerService.sendMessage<{ group: string; languageCode: string }, any[]>(
                GlobalRpcAction.GET_TRANSLATION,
                { group, languageCode: 'en' },
            );
        else return response.data;

        return response.data;
    }
}
