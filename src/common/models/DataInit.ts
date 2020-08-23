export class DataInit {
    version: string;
    defs: DataInitDefinition[];

    static mapDelimiterToChar(delimiter?: DataInitCsvSeparatorType): string {
        switch (delimiter) {
            case DataInitCsvSeparatorType.comma:
                return ',';
            case DataInitCsvSeparatorType.semicolon:
                return ';';
            case DataInitCsvSeparatorType.tab:
                return '\t';
            default:
                return null;
        }
    }
}

class DataInitDefinition {
    name: string;
    files: string[];
    type: DataInitDefinitionFileType;
    chunkSize: number;
    csvOptions: DataInitCsvOptions;
}

class DataInitCsvOptions {
    entity: string;
    delimiter?: DataInitCsvSeparatorType;
    columnsMapping: DataInitColumnMapping[];
    header: boolean;
    checkColumns: string[];
    quoteChar: string;
    circularRelation: DataInitCircularRelation;
    cardinalRelations: DataInitCardinalRelations[];
}

class DataInitColumnMapping {
    column: string;
    field: string;
}

class DataInitCircularRelation {
    parentColumn: string;
    mappedByColumn: string;
    childKeyColumn: string;
    parentField: string;
}

class DataInitCardinalRelations {
    cardinality: DataInitCardinalityType;
    targetEntity: string;
    targetKeyColumn: string;
    sourceKeyColumn: string;
    targetKeyField: string;
    sourceRelationField: string;
}

enum DataInitDefinitionFileType {
    csv,
    json,
    xml,
}

enum DataInitCsvSeparatorType {
    none,
    comma,
    semicolon,
    tab,
}

export enum DataInitCardinalityType {
    oneToOne = 'one-to-one',
    oneToMany = 'one-to-many',
    manyToOne = 'many-to-one',
    manyToMany = 'many-to-many',
}
