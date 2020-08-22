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
    relationsMapping: DataInitRelationMapping[];
}

class DataInitColumnMapping {
    column: string;
    field: string;
}

class DataInitRelationMapping {
    parentColumn: string;
    mappedByColumn: string;
    childKeyColumn: string;
    parentField: string;
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
