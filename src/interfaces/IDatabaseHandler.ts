export type DBStruct = {
    [modelName: string]: Array<SchemasStruct | (string | number)>
}

export type SchemasStruct = { [valueKey: string]: any }
export type SchemaStruct = (string | number)

export interface IDatabaseHandlerContructor {
    new(path: string): IDatabaseHandler;
}

export interface IDatabaseHandler {
    read(): Promise<DBStruct>;
    append(modelName: string, data: object | string | number): Promise<void>;
    delete(modelName: string, param: object | string | number): Promise<void>;
}