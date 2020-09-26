import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { AuthGuard } from 'primebrick-sdk';
import { DataAccessService } from './dataaccess.service';
import { QueryPayload } from './models/QueryPayload';
import { QueryResult } from './models/QueryResult';
import { SavePayload } from './models/SavePayload';

@Controller('api/data')
@UseGuards(AuthGuard)
export class DataAccessSecureController {
    constructor(private readonly dataAccessService: DataAccessService) {}

    @Post('find')
    async find(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.find(query);
    }

    @Post('findOne')
    async findOne(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.findOne(query);
    }

    @Post('save')
    async save(@Body() payload: SavePayload): Promise<QueryResult> {
        return await this.dataAccessService.save(payload.entityName, payload.entity);
    }

    @Post('info')
    async info(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.info(query);
    }
}
