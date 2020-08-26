export class QueryPayload {
    entity: string;
    fields: string[];
    filters: QueryFilter[];
}

class QueryFilter {
    leftOperator: QueryOperator;
    expressionOperator: QueryOperator;
    expressions: string[];
}

export enum QueryOperator {
    AND = 'AND',
    OR = 'OR',
}
