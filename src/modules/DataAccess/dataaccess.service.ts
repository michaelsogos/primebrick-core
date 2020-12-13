import { Injectable } from '@nestjs/common';
import {
    AdvancedLogger,
    QueryPayload,
    QueryResult,
    ProcessorManagerService,
    ModuleRpcAction,
    ComposeModuleRpcAction,
    SavePayload,
} from 'primebrick-sdk';

@Injectable()
export class DataAccessService {
    constructor(private readonly processorManagerService: ProcessorManagerService, private readonly logger: AdvancedLogger) {
        logger.setContext('DataAccessService');
    }

    async findMany(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, ModuleRpcAction.DATA_FIND_MANY),
            query,
        );

        return response.data;
    }

    async findOne(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, ModuleRpcAction.DATA_FIND_ONE),
            query,
        );

        return response.data;
    }

    async save(payload: SavePayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot save entity with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot save entity with empty or invalid entity name!');
        if (!payload.entity) throw new Error('Cannot save entity with empty or invalid entity data model!');

        const response = await this.processorManagerService.sendMessage<SavePayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, ModuleRpcAction.DATA_SAVE),
            payload,
        );

        return response.data;
    }

    async info(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, ModuleRpcAction.DATA_INFO),
            query,
        );

        return response.data;
    }
}
