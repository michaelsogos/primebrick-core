import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { AuthGuard, Context, ContextPayload } from 'primebrick-sdk';
import { DataAccessService } from './dataaccess.service';
import { QueryPayload } from './models/QueryPayload';
import { QueryResult } from './models/QueryResult';

@Controller('api/data')
@UseGuards(AuthGuard)
export class DataAccessSecureController {
    constructor(private readonly dataAccessService: DataAccessService) {}

    @Post('find')
    async find(@Context() context: ContextPayload, @Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.find(context, query);
    }
}
