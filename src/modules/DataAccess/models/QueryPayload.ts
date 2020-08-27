export class QueryPayload {
    entity: string;
    fields: string[];
    filters: QueryFilter[];
    sorts: QuerySort[];
    take: number;
    skip: number;
}

class QueryFilter {
    leftOperator: QueryFilterOperator;
    expressionOperator: QueryFilterOperator;
    expressions: string[];
}

class QuerySort {
    field: string;
    direction: QuerySortDirection;
}

export enum QueryFilterOperator {
    AND = 'AND',
    OR = 'OR',
}

export enum QuerySortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}
