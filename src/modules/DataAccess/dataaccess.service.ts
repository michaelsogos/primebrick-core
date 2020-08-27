import { Injectable } from '@nestjs/common';
import { TenantRepositoryService, ContextPayload } from 'primebrick-sdk';
import { QueryPayload, QueryFilterOperator, QuerySortDirection } from './models/QueryPayload';
import { QueryResult } from './models/QueryResult';
import { Brackets } from 'typeorm';

@Injectable()
export class DataAccessService {
    constructor(private readonly repositoryService: TenantRepositoryService) {}

    async find(context: ContextPayload, query: QueryPayload): Promise<QueryResult> {
        const dbconn = await this.repositoryService.getTenantConnection(context.tenantAlias);
        const queryBuilder = dbconn.createQueryBuilder(query.entity, query.entity);

        if (query.fields && query.fields.length > 0) {
            queryBuilder.select([`${query.entity}.id`]);
            for (const field of query.fields) {
                queryBuilder.addSelect(`${query.entity}.${field}`);
            }
        }

        if (query.filters && query.filters.length > 0) {
            for (const filter of query.filters) {
                if (filter.leftOperator && filter.leftOperator == QueryFilterOperator.OR)
                    queryBuilder.orWhere(
                        new Brackets(qb => {
                            for (const condition of filter.expressions) {
                                if (filter.expressionOperator && filter.expressionOperator == QueryFilterOperator.OR)
                                    qb.orWhere(condition.replace('$self', query.entity));
                                else qb.andWhere(condition.replace('$self', query.entity));
                            }
                        }),
                    );
                else
                    queryBuilder.andWhere(
                        new Brackets(qb => {
                            for (const condition of filter.expressions) {
                                if (filter.expressionOperator && filter.expressionOperator == QueryFilterOperator.OR)
                                    qb.orWhere(condition.replace('$self', query.entity));
                                else qb.andWhere(condition.replace('$self', query.entity));
                            }
                        }),
                    );
            }
        }

        if (query.sorts) {
            queryBuilder.orderBy();
            for (const sort of query.sorts)
                queryBuilder.addOrderBy(
                    `${query.entity}.${sort.field}`,
                    sort.direction || QuerySortDirection.ASC,
                    !sort.direction || sort.direction == QuerySortDirection.ASC ? 'NULLS LAST' : 'NULLS FIRST',
                );
        }

        if (query.take) queryBuilder.take(query.take);

        if (query.skip) queryBuilder.skip(query.skip);

        const result = await queryBuilder.getManyAndCount();
        return new QueryResult(result[0], result[1]);
    }
}
