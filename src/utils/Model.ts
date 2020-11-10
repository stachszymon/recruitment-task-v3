import { type } from "os";
import db from "./db";

export function createModel(databaseName: string, schema: Schema | Schemas): IModel {
    return class {

        private data: object = {};
        private static model: Model = new Model(databaseName, schema)

        dbName = databaseName;
        schema = schema;

        constructor(data?: object) {
            if (data) this.data = data;

            return new Proxy(this, {
                get: (obj: any, key: string | number | symbol, receiver: any) => {
                    if (typeof key === 'string' && ['save', 'getData', 'setData'].includes(key)) {
                        return obj[key].bind(obj);
                    }
                    return obj.data[key];
                },
                set: (obj: any, key: string | number | symbol, value: any, receiver: any) => {
                    obj.data[key] = value;
                    return true;
                }
            })
        }

        save(): Promise<IModelContruct> {
            return Promise.resolve(this)
        }

        getData(): object {
            return { ...this.data };
        }

        setData(data: object): IModelContruct {
            this.data = { ...data };
            return this;
        }

        static async find(param?: params) {
            return this.model.find(param);
        }

        static async delete(param: params) {
            return this.model.delete(param)
        }

        static async update(data: object) {
            return this.model.update(data);
        }

        static async create(data: object) {
            return this.model.create(data);
        }
    }
}

class Model {

    protected schema: Schema | Schemas;
    protected dbName: string;

    constructor(name: string, schema: Schema | Schemas) {
        this.dbName = name;
        this.schema = schema;
    }

    async find(params?: params): Promise<any> {

        try {
            const data = await db.read();

            if (params == null) {
                return data[this.dbName];
            } else {
                data[this.dbName]?.filter(el => {
                    const entries = Object.entries(params);

                    if (entries.length > 0) {
                        let result = true;

                        entries.forEach(([k, v]) => {
                            result = el[k] != null && el[k] == v ? false : true;
                        })

                        return result
                    } else {
                        return true;
                    }
                })
            }

        } catch (err) {
            throw new Error(err);
        }

    }

    async delete(param: params): Promise<void> {
        try {
            return db.delete(this.dbName, param)
        } catch (err) {
            throw new Error(err);
        }
    }

    async update(data: object): Promise<undefined> {
        return Promise.resolve(undefined)
    }

    async create(data: object): Promise<object> {
        try {
            await db.append(this.dbName, data);
            return data;
        } catch (err) {
            throw new Error(err);
        }
    }
}

export interface IModel {
    new(data?: object): IModelContruct
    find(param?: params): Promise<any>
    delete(param: params): Promise<void>
    update(data: object): Promise<undefined>
    create(data: object): Promise<object>
    [key: string]: any
}

export interface IModelContruct {
    save(): Promise<IModelContruct>
    getData(): object
    setData(data: object): IModelContruct
    [key: string]: any
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

export type params = {
    [key: string]: string | number
}