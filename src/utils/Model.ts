import db from "./db";

export function createModel(databaseName: string, schema: Schema | Schemas): any {
    return class extends Model {

        private data: object = {};

        constructor(data: object) {
            super(databaseName, schema);
            this.data = data;

            return new Proxy(this, {
                get: (obj: any, key: string | number | symbol, receiver: any) => {
                    return obj.data[key];
                },
                set: (obj: any, key: string | number | symbol, value: any, receiver: any) => {
                    obj.data[key] = value;
                    return true;
                }
            })
        }

        save(): Promise<object> {
            return Promise.resolve({})
        }

        getData() {
            return { ...this.data };
        }

        setData(data: object) {
            this.data = { ...data };
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

    static create(data: object): Promise<object> {
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