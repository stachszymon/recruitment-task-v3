import db from "./db";

export function createModel(databaseName: string, schema: Schema | Schemas): any {
    return class extends Model {
        private data: object;

        constructor(data: object) {
            super(databaseName, schema);
            this.data = data;
        }

        save(): Promise<object> {
            return Promise.resolve({})
        }
    }
}

export default class Model {

    private schema: Schema | Schemas;
    private dbName: string;

    constructor(name: string, schema: Schema | Schemas) {
        this.dbName = name;
        this.schema = schema;
    }

    static find(): Promise<object | Array<object>> {
        return Promise.resolve({});
    }

    static delete(): Promise<undefined> {
        return Promise.resolve(undefined);
    }

    static update(): Promise<undefined> {
        return Promise.resolve(undefined)
    }

    static create(): Promise<object> {
        return Promise.resolve({})
    }

}

export type Schema = {
    type: Types
    required?: boolean
    validation?: Function
}

export type Schemas = {
    [key: string]: Schema
}

export enum Types {
    String,
    Number,
    Array
}