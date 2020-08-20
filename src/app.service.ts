import { Injectable } from '@nestjs/common';
import { Migration } from 'typeorm';
import { TenantRepositoryService } from 'primebrick-sdk';
import * as path from 'path';
import * as fs from 'fs';
import { DataInit } from './common/models/DataInit';
import * as papa from 'papaparse';

@Injectable()
export class AppService {
    constructor(private readonly repositoryService: TenantRepositoryService) {}

    async runMigrations(tenantAlias: string): Promise<Migration[]> {
        const connection = await this.repositoryService.getTenantConnection(tenantAlias);
        return await connection.runMigrations();
    }

    async importCsv(tenantAlias: string, moduleName: string): Promise<any[]> {
        //TODO: @mso -> Create a model for return type array
        const directoryPath = path.join(__dirname, 'modules', moduleName, 'resources', 'imports');
        const literalJson = fs.readFileSync(path.join(directoryPath, 'data-init.json'), 'utf8');
        const dataInit: DataInit = JSON.parse(literalJson);
        const importLogs = [];

        for (const definition of dataInit.defs) {
            for (const file of definition.files) {
                try {
                    const rawCsv = fs.readFileSync(path.join(directoryPath, file), 'utf8');
                    const csv = papa.parse(rawCsv, {
                        skipEmptyLines: true,
                        header: definition.csvOptions.header != undefined ? definition.csvOptions.header : true,
                        quoteChar: definition.csvOptions.quoteChar || '"',
                        delimiter: DataInit.mapDelimiterToChar(definition.csvOptions.delimiter),
                    });
                    const dbconn = await this.repositoryService.getTenantConnection(tenantAlias);
                    const repository = dbconn.getRepository(definition.csvOptions.entity);
                    const entities = [];

                    for (let x = 0; x < csv.data.length; x++) {
                        const record: any = csv.data[x];
                        let entity = repository.create();

                        if (definition.csvOptions.checkColumns && definition.csvOptions.checkColumns.length > 0) {
                            const findConditions = {};
                            for (const checkColumn of definition.csvOptions.checkColumns) {
                                const mapping = !definition.csvOptions.mapping
                                    ? null
                                    : definition.csvOptions.mapping.find(item => item.column == checkColumn);

                                if (!mapping && Object.prototype.hasOwnProperty.call(record, checkColumn))
                                    findConditions[checkColumn] = record[checkColumn];
                                else if (mapping && Object.prototype.hasOwnProperty.call(record, checkColumn))
                                    findConditions[mapping.field] = record[checkColumn];
                                else
                                    throw new Error(
                                        `Cannot find check column [${checkColumn}].\nIt should be defined as mapped column or at least should be the name of existing csv column!`,
                                    );
                            }

                            const sourceEntity = await repository.findOne(null, {
                                where: findConditions,
                            });

                            if (sourceEntity) entity = sourceEntity;
                        }

                        if (definition.csvOptions.mapping && definition.csvOptions.mapping.length > 0)
                            for (const mapping of definition.csvOptions.mapping) {
                                if (!Object.prototype.hasOwnProperty.call(record, mapping.column))
                                    throw new Error(`Cannot find column [${mapping.column}] at line ${x + 1}!`);

                                entity[mapping.field] = record[mapping.column]; //TODO: @mso -> Add a "transformer/parser/transpiler/custom logic" method or expression in mapping in order to handle DTO logic before assign value to entity field
                            }
                        else {
                            for (const field in record) {
                                entity[field] = record[field];
                            }
                        }

                        entities.push(entity);
                    }

                    const persistedEntities = (await repository.save(entities, { chunk: definition.chunkSize || 1000 })).length;

                    importLogs.push({
                        status: 'success',
                        message: `Import succeded`,
                        file: file,
                        count: persistedEntities,
                        definition: definition.name,
                        timestamp: Date.now,
                        entity: definition.csvOptions.entity,
                    });
                } catch (ex) {
                    importLogs.push({
                        status: 'failed',
                        message: ex.message,
                        file: file,
                        count: 0,
                        definition: definition.name,
                        timestamp: Date.now,
                        entity: definition.csvOptions.entity,
                    });
                }
            }
        }

        return importLogs;
    }
}
