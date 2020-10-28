export interface IDatabaseHandlerContructor {
    new(path: string): IDatabaseHandler;
}

export interface IDatabaseHandler {
    read(): Promise<Array<object> | object>;
    write(): Promise<boolean>;
    append(): Promise<boolean>;
    delete(): Promise<boolean>;
}