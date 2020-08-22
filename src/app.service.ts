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

                        //Make where conditions to find exsiting entity
                        if (definition.csvOptions.checkColumns && definition.csvOptions.checkColumns.length > 0) {
                            const findConditions = {};
                            for (const checkColumn of definition.csvOptions.checkColumns) {
                                const mapping = !definition.csvOptions.columnsMapping
                                    ? null
                                    : definition.csvOptions.columnsMapping.find(item => item.column == checkColumn);

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

                        //Set entity fields upon mapping or by csv column name
                        if (definition.csvOptions.columnsMapping && definition.csvOptions.columnsMapping.length > 0)
                            for (const mapping of definition.csvOptions.columnsMapping) {
                                if (!Object.prototype.hasOwnProperty.call(record, mapping.column))
                                    throw new Error(`Cannot find column [${mapping.column}] at line ${x + 1}!`);

                                entity[mapping.field] = record[mapping.column]; //TODO: @mso -> Add a "transformer/parser/transpiler/custom logic" method or expression in mapping in order to handle DTO logic before assign value to entity field
                            }
                        else {
                            for (const field in record) {
                                if (!field.startsWith('$') && Object.prototype.hasOwnProperty.call(record, field)) entity[field] = record[field];
                            }
                        }

                        if (repository.metadata.columns.some(column => column.propertyName == 'importedBy')) entity['importedBy'] = -1; //TODO: @mso -> Collect from context the LOGGED IN USER ID
                        if (repository.metadata.columns.some(column => column.propertyName == 'importedOn')) entity['importedOn'] = new Date();
                        entities.push(entity);
                    }

                    let persistedEntities = 0;

                    //Link entities with related entity
                    if (definition.csvOptions.relationsMapping && definition.csvOptions.relationsMapping.length > 0) {
                        for (const relationMapping of definition.csvOptions.relationsMapping) {
                            const savedParents = [];
                            const recordsToLink = csv.data.filter(record => record[relationMapping.parentColumn]);

                            for (const record of recordsToLink) {
                                let parentEntity = savedParents.find(
                                    parent => parent[relationMapping.mappedByColumn] == record[relationMapping.parentColumn],
                                );

                                if (!parentEntity) {
                                    const parentEntityIndex = entities.findIndex(
                                        entity => entity[relationMapping.mappedByColumn] == record[relationMapping.parentColumn],
                                    );
                                    parentEntity = entities[parentEntityIndex];
                                    parentEntity = await repository.save(parentEntity);
                                    persistedEntities++;
                                    savedParents.push(parentEntity);
                                    entities.splice(parentEntityIndex, 1);
                                }

                                const childKeyField = definition.csvOptions.columnsMapping
                                    ? definition.csvOptions.columnsMapping.find(mapping => mapping.column == relationMapping.childKeyColumn).field
                                    : relationMapping.childKeyColumn;

                                const childEntityIndex = entities.findIndex(
                                    entity => entity[childKeyField] == record[relationMapping.childKeyColumn],
                                );
                                if (childEntityIndex >= 0) entities[childEntityIndex][relationMapping.parentField] = parentEntity;
                            }
                        }
                    }

                    persistedEntities += (await repository.save(entities, { chunk: definition.chunkSize || 1000 })).length;

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
