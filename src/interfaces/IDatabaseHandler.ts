export type DBStruct = {
    [modelName: string]: [
        {
            [valueKey: string]: any
        }
    ]
}

export interface IDatabaseHandlerContructor {
    new(path: string): IDatabaseHandler;
}

export interface IDatabaseHandler {
    read(): Promise<DBStruct>;
    append(modelName: string, data: object): Promise<void>;
    delete(modelName: string, param: object): Promise<void>;
}