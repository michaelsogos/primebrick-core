import { Injectable } from '@nestjs/common';
import { TenantRepositoryService, ContextPayload } from 'primebrick-sdk';
import { QueryPayload, QueryOperator } from './models/QueryPayload';
import { QueryResult } from './models/QueryResult';
import { Brackets } from 'typeorm';

@Injectable()
export class DataAccessService {
    constructor(private readonly repositoryService: TenantRepositoryService) {}

    async find(context: ContextPayload, query: QueryPayload): Promise<QueryResult> {
        const dbconn = await this.repositoryService.getTenantConnection(context.tenantAlias);
        const queryBuilder = dbconn.createQueryBuilder(query.entity, query.entity);

        if (query.fields && query.fields.length > 0) {
            queryBuilder.select([]);
            for (const field of query.fields) {
                queryBuilder.addSelect(`${query.entity}.${field}`);
            }
        }

        if (query.filters && query.filters.length > 0) {
            for (const filter of query.filters) {
                if (filter.leftOperator && filter.leftOperator == QueryOperator.OR)
                    queryBuilder.orWhere(
                        new Brackets(qb => {
                            for (const condition of filter.expressions) {
                                if (filter.expressionOperator && filter.expressionOperator == QueryOperator.OR)
                                    qb.orWhere(condition.replace('$self', query.entity));
                                else qb.andWhere(condition.replace('$self', query.entity));
                            }
                        }),
                    );
                else
                    queryBuilder.andWhere(
                        new Brackets(qb => {
                            for (const condition of filter.expressions) {
                                if (filter.expressionOperator && filter.expressionOperator == QueryOperator.OR)
                                    qb.orWhere(condition.replace('$self', query.entity));
                                else qb.andWhere(condition.replace('$self', query.entity));
                            }
                        }),
                    );
            }
        }

        const result = await queryBuilder.getManyAndCount();
        return new QueryResult(result[0], result[1]);
    }
}
