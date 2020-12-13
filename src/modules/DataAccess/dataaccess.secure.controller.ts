import { Controller, UseGuards, Body, Post } from '@nestjs/common';
import { AuthGuard, QueryPayload, QueryResult, SavePayload } from 'primebrick-sdk';
import { DataAccessService } from './dataaccess.service';

@Controller('api/data')
@UseGuards(AuthGuard)
export class DataAccessSecureController {
    constructor(private readonly dataAccessService: DataAccessService) {}

    @Post('find')
    async find(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.findMany(query);
    }

    @Post('findOne')
    async findOne(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.findOne(query);
    }

    @Post('save')
    async save(@Body() payload: SavePayload): Promise<QueryResult> {
        return await this.dataAccessService.save(payload);
    }

    @Post('info')
    async info(@Body() query: QueryPayload): Promise<QueryResult> {
        return await this.dataAccessService.info(query);
    }
}
