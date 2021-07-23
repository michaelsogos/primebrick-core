import { Controller, Get, Query } from '@nestjs/common';
import { QueryPayload, QueryResult } from 'primebrick-sdk';
import { QueryFilterOperator } from 'primebrick-sdk/dist/modules/MicroserviceManager/models/QueryPayload';
import { DataAccessService } from './modules/DataAccess/dataaccess.service';

@Controller('api')
export class AppController {
    constructor(private readonly dataAccessService: DataAccessService) {}

    @Get('meta/translations')
    async getTranslations(@Query('languageCode') languageCode: string, @Query('group') translationGroup: string): Promise<QueryResult> {
        const query = new QueryPayload();
        query.brick = 'core';
        query.entity = 'MetaTranslation';
        query.fields = ['key', 'languageCode', 'value', 'group', 'isTemplate'];
        query.filters = [
            {
                expressions: ['$self.languageCode = :languageCode ', '$self.group = :translationGroup'],
                expressionValues: { languageCode, translationGroup },
                expressionOperator: QueryFilterOperator.AND,
                leftOperator: QueryFilterOperator.AND,
            },
        ];

        return await this.dataAccessService.findMany(query);
    }
}
