export default interface IDatabaseReader {
    read(): Promise<Array<object> | object>;
    write(): Promise<boolean>;
}