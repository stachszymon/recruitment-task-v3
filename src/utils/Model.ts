import { IModel, IModelContruct, dataObject, params, Schema, Schemas } from '../interfaces/IModel';
import db from "./db";

export function createModel(databaseName: string, schema: Schema | Schemas): IModel {
    return class StaticModel {

        private data: dataObject = {};
        private static model: Model = new Model(databaseName, schema)

        dbName = databaseName;
        schema = schema;

        constructor(data?: dataObject) {
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

        async save(): Promise<IModelContruct> {
            const data: dataObject = this.getData();

            if (this.data.id == null) {
                const allModels = await StaticModel.model.find();

                await StaticModel.model.create({ id: allModels.length, ...data });
            } else {
                await StaticModel.model.delete({ id: this.data.id });
                await StaticModel.model.create({ ...data })
            }

            return this
        }

        getData(): dataObject {
            return this.data;
        }

        setData(data: dataObject): IModelContruct {
            this.data = data;
            return this;
        }

        static async find(param?: params) {
            return this.model.find(param);
        }

        static async delete(param: params) {
            return this.model.delete(param)
        }

        static async update(data: dataObject) {
            return this.model.update(data);
        }

        static async create(data: dataObject) {
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

    async find(params?: params): Promise<Array<object>> {
        const data = await db.read();

        if (params == null) {
            return data[this.dbName];
        } else {
            const entries = Object.entries(params);
            if (entries.length === 0) return data[this.dbName];

            return data[this.dbName]?.filter(el => entries.some(([k, v]) => el[k] != null && el[k] == v))
        }

    }

    async delete(param: params): Promise<void> {
        return db.delete(this.dbName, param)
    }

    async update(data: dataObject): Promise<undefined> {
        this.validate(data);

        return Promise.resolve(undefined)
    }

    async create(data: dataObject): Promise<object> {
        this.validate(data);
        await db.append(this.dbName, data);
        return data;
    }

    private validate(data: dataObject): { data: dataObject, errors: (string | undefined)[], valid: boolean } {
        return Object.entries(this.schema).reduce((returnValue, entry: [string, Schema]) => {
            const
                [key, props] = entry,
                item: string | number | (string | number)[] | undefined = data[key];

            if (props.required === true && item == null) {
                data[key] = undefined;
                returnValue.errors.push(`${key} is required`);
            } else if (item != null && props.validation != null) {
                const v = props.validation(item);
                if (v != null) returnValue.errors.push(...v);
            }

            returnValue.valid = returnValue.errors.length === 0;

            return returnValue;
        }, {
            data: {} as dataObject,
            errors: [] as (string | undefined)[],
            valid: false as boolean
        })
    }
}