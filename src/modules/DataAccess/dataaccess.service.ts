import { Injectable } from '@nestjs/common';
import { ComposeModuleRpcAction, DataRpcAction } from 'primebrick-sdk/enums';
import {
    ArchiveOrRestorePayload,
    DeleteOrArchiveOrRestoreManyPayload,
    DeletePayload,
    QueryPayload,
    QueryResult,
    SavePayload,
} from 'primebrick-sdk/models';
import { LogManagerService, ProcessorManagerService } from 'primebrick-sdk/modules';

@Injectable()
export class DataAccessService {
    constructor(private readonly processorManagerService: ProcessorManagerService, private readonly logger: LogManagerService) {}

    async findMany(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, DataRpcAction.DATA_FIND_MANY),
            query,
        );

        return response.data;
    }

    async findOne(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, DataRpcAction.DATA_FIND_ONE),
            query,
        );

        return response.data;
    }

    async save(payload: SavePayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot save entity with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot save entity with empty or invalid entity name!');
        if (!payload.entity) throw new Error('Cannot save entity with empty or invalid entity data model!');

        const response = await this.processorManagerService.sendMessage<SavePayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_SAVE),
            payload,
        );

        return response.data;
    }

    async delete(payload: DeletePayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot delete entity with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot delete entity with empty or invalid entity name!');
        if (!Number.isFinite(payload.entityId)) throw new Error('Cannot delete entity with empty or invalid entity id!');

        const response = await this.processorManagerService.sendMessage<DeletePayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_DELETE),
            payload,
        );

        return response.data;
    }

    async deleteMany(payload: DeleteOrArchiveOrRestoreManyPayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot delete entities with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot delete entities with empty or invalid entity name!');
        if (!payload.entityIds || payload.entityIds.length <= 0) throw new Error('Cannot delete entities with empty or invalid list of entity ids!');

        const response = await this.processorManagerService.sendMessage<DeleteOrArchiveOrRestoreManyPayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_DELETE_MANY),
            payload,
        );

        return response.data;
    }

    async archive(payload: ArchiveOrRestorePayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot archive entity with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot archive entity with empty or invalid entity name!');
        if (!Number.isFinite(payload.entityId)) throw new Error('Cannot archive entity with empty or invalid entity id!');

        const response = await this.processorManagerService.sendMessage<ArchiveOrRestorePayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_ARCHIVE),
            payload,
        );

        return response.data;
    }

    async archiveMany(payload: DeleteOrArchiveOrRestoreManyPayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot archive entities with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot archive entities with empty or invalid entity name!');
        if (!payload.entityIds || payload.entityIds.length <= 0) throw new Error('Cannot archive entities with empty or invalid list of entity ids!');

        const response = await this.processorManagerService.sendMessage<DeleteOrArchiveOrRestoreManyPayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_ARCHIVE_MANY),
            payload,
        );

        return response.data;
    }

    async restore(payload: ArchiveOrRestorePayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot restore entity with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot restore entity with empty or invalid entity name!');
        if (!Number.isFinite(payload.entityId)) throw new Error('Cannot restore entity with empty or invalid entity id!');

        const response = await this.processorManagerService.sendMessage<ArchiveOrRestorePayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_RESTORE),
            payload,
        );

        return response.data;
    }

    async restoreMany(payload: DeleteOrArchiveOrRestoreManyPayload): Promise<QueryResult> {
        if (!payload.brickName) throw new Error('Cannot restore entities with empty or invalid brick name!');
        if (!payload.entityName) throw new Error('Cannot restore entities with empty or invalid entity name!');
        if (!payload.entityIds || payload.entityIds.length <= 0) throw new Error('Cannot restore entities with empty or invalid list of entity ids!');

        const response = await this.processorManagerService.sendMessage<DeleteOrArchiveOrRestoreManyPayload, QueryResult>(
            ComposeModuleRpcAction(payload.brickName, DataRpcAction.DATA_RESTORE_MANY),
            payload,
        );

        return response.data;
    }

    async info(query: QueryPayload): Promise<QueryResult> {
        if (!query.brick) throw new Error('Cannot execute query with empty or invalid brick name!');
        if (!query.entity) throw new Error('Cannot execute query with empty or invalid entity name!');

        const response = await this.processorManagerService.sendMessage<QueryPayload, QueryResult>(
            ComposeModuleRpcAction(query.brick, DataRpcAction.DATA_INFO),
            query,
        );

        return response.data;
    }
}
