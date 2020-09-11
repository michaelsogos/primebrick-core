import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { AuthGuard, Context, ContextPayload } from 'primebrick-sdk';
import { DataAccessService } from './dataaccess.service';
import { QueryPayload } from './models/QueryPayload';
import { QueryResult } from './models/QueryResult';
import { SavePayload } from './models/SavePayload';

@Controller('api/data')
@UseGuards(AuthGuard)
export class DataAccessSecureController {
    constructor(private readonly dataAccessService: DataAccessService) {}

    @Post('find')
    async find(@Context() context: ContextPayload, @Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.find(context, query);
    }

    @Post('findOne')
    async findOne(@Context() context: ContextPayload, @Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.findOne(context, query);
    }

    @Post('save')
    async save(@Context() context: ContextPayload, @Body() payload: SavePayload): Promise<QueryResult> {
        return await this.dataAccessService.save(context, payload.entityName, payload.entity);
    }

    @Post('info')
    async info(@Context() context: ContextPayload, @Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.info(context, query);
    }
}
