import { Controller, Get, Query } from '@nestjs/common';
import { GlobalRpcAction, ProcessorManagerService } from 'primebrick-sdk';

@Controller('api')
export class AppController {
    constructor(private readonly processorManagerService: ProcessorManagerService) {}

    @Get('meta/translations')
    async getTranslations(
        // @Req() request: Request,
        // @Query('languageCode') languageCode: string,
        @Query('group') group: string,
    ): Promise<any[]> {
        // const browserLanguage = request.acceptsLanguages().filter((s) => !s.includes('*'));
        // if (!languageCode && browserLanguage.length > 0) languageCode = browserLanguage[0].split('-')[0];
        // if (!languageCode) throw new PreconditionFailedException("Missing query parameter 'languageCode'!");
        // if (!translationGroup) throw new PreconditionFailedException("Missing query parameter 'group'!");

        // const query = new QueryPayload();
        // query.brick = 'core';
        // query.entity = 'MetaTranslation';
        // query.fields = ['key', 'languageCode', 'value', 'group', 'isTemplate'];
        // query.filters = [
        //     {
        //         expressions: ['$self.languageCode = :languageCode ', '$self.group = :translationGroup'],
        //         expressionValues: { languageCode, translationGroup },
        //         expressionOperator: QueryFilterOperator.AND,
        //         leftOperator: QueryFilterOperator.AND,
        //     },
        // ];

        // const queryResult = await this.dataAccessService.findMany(query);

        // if (queryResult.count <= 0) query.filters[0].expressionValues['languageCode'] = 'en';
        // else return queryResult;

        // return await this.dataAccessService.findMany(query);

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
