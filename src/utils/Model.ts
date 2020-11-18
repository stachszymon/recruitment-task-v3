import { dataObjectRaw } from './../interfaces/IModel';
import { IModel, IModelContruct, paramObject, dataObject, params, Schema, Schemas } from '../interfaces/IModel';
import ValidationError from "./ValidationError"
import db from "./db";

export function createModel(
    databaseName: string,
    schema: Schemas | Schema,
    isSingleModel: boolean
): IModel {
    return class StaticModel {

        private data: dataObject = {};
        private static model: SingleModel | Model = isSingleModel ?
            new SingleModel(databaseName, schema as Schema) :
            new Model(databaseName, schema as Schemas)
        private proxy: any;

        dbName = databaseName;
        schema = schema;

        constructor(data?: dataObject) {
            if (data) this.data = data;

            this.proxy = new Proxy(this, {
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

            return this.proxy;
        }

        async save(): Promise<IModelContruct> {
            const data: dataObject = this.getData();
            StaticModel.model instanceof SingleModel ? await StaticModel.model.create(data as string | number)
                : await StaticModel.model.create(data as dataObjectRaw)
            return this.proxy
        }

        getData(): dataObject {
            return this.data;
        }

        setData(data: dataObject): IModelContruct {
            this.data = data;
            return this.proxy;
        }

        static async find(param?: params) {
            return (this.model instanceof SingleModel) ? this.model.find(param as string | number)
                : this.model.find(param as paramObject)
        }

        static async delete(param: params) {
            return (this.model instanceof SingleModel) ? this.model.delete(param as string | number)
                : this.model.delete(param as paramObject)
        }

        static async update(data: dataObject, params: params) {
            return (this.model instanceof SingleModel) ? this.model.update(data as string | number, params as string | number)
                : this.model.update(data as dataObjectRaw, params as paramObject);
        }

        static async create(data: dataObject) {
            return (this.model instanceof SingleModel) ? this.model.create(data as string | number)
                : this.model.create(data as dataObjectRaw);
        }
    }
}

export class SingleModel {

    protected schema: Schema;
    protected dbName: string;

    constructor(name: string, schema: Schema) {
        this.dbName = name;
        this.schema = schema;
    }

    async find(params?: string | number): Promise<Array<string | number>> {
        const data = await db.read(),
            model = data[this.dbName] as Array<string | number>;

        return params == null ? model : model?.filter(el => typeof el === 'string' ? el.includes("" + params) : el === params)
    }

    async delete(params: string | number): Promise<void> {
        return db.delete(this.dbName, params)
    }

    async update(newData: string | number, oldParams: string | number): Promise<string | number> {

        const validData = await this.validate(newData)

        if (validData.valid === false) throw new ValidationError(validData.errors);

        await Promise.all([
            this.delete(oldParams),
            this.create(validData.data)
        ])

        return validData.data;
    }

    async create(data: string | number): Promise<string | number> {

        const list = (await db.read())[this.dbName];

        if (list.includes(data)) {
            return data;
        }

        const validatedData = await this.validate(data);

        if (validatedData.valid === false) {
            throw new ValidationError(validatedData.errors);
        } else {
            await db.append(this.dbName, validatedData.data);
            return validatedData.data;
        }
    }

    private async validate(data: string | number): Promise<validatedData<string | number>> {
        const validatedData: validatedData<string | number> = {
            data,
            errors: [],
            valid: false,
        }

        const props = this.schema;

        if (props.required === true && data == null) {
            validatedData.errors.push(`"value" is required`);
        } else if (data != null) {

            if ((props.type === 'array' && data?.constructor.name !== 'Array') || (props.type !== 'array' && typeof data !== props.type)) {
                validatedData.errors.push(`${'value'} has invalid type expected to be ${props.type}`)
            } else if (props.validation != null) {
                const v = await props.validation(data);
                if (v != null) validatedData.errors.push(...v);
            }
            validatedData.data = data;
        }

        validatedData.valid = validatedData.errors.length === 0;
        return validatedData;
    }
}

export class Model {

    protected schema: Schemas;
    protected dbName: string;

    constructor(name: string, schema: Schemas) {
        this.dbName = name;
        this.schema = schema;
    }

    async find(params?: paramObject): Promise<Array<object>> {
        const data = await db.read(),
            model = data[this.dbName] as Array<dataObjectRaw>;

        if (params == null) {
            return model;
        } else {
            const entries = Object.entries(params);
            if (entries.length === 0) return model;

            return model?.filter(el => entries.some(([k, v]) => el[k] != null && el[k] == v))
        }
    }

    async delete(param: paramObject): Promise<void> {
        return db.delete(this.dbName, param)
    }

    async update(data: dataObjectRaw, oldParams: paramObject): Promise<object> {

        const validData = await this.validate(data);

        if (validData.valid === false) throw new ValidationError(validData.errors);

        if (data.id != oldParams.id) {
            await this.delete({ id: oldParams.id })
        }

        await this.create(validData.data)

        return validData.data;
    }

    async create(data: dataObjectRaw): Promise<object> {
        const idWasNull = data.id == null;

        if (idWasNull === true) {
            const lastID = (await db.read())[this.dbName].length;
            data.id = lastID;
        }

        const validatedData = await this.validate(data);

        if (validatedData.valid === false) {
            throw new ValidationError(validatedData.errors);
        } else {
            if (idWasNull === false) {
                await db.delete(this.dbName, { id: data.id })
            }

            await db.append(this.dbName, validatedData.data);

            return validatedData.data;
        }
    }

    private async validate(data: dataObjectRaw): Promise<validatedData<dataObjectRaw>> {
        const returnValue: validatedData<dataObjectRaw> = {
            data: {} as dataObjectRaw,
            errors: [] as (string)[],
            valid: false as boolean
        }

        await Object.entries(this.schema).forEach(async (entry: [string, Schema]) => {
            const
                [key, props] = entry,
                item: string | number | (string | number)[] | undefined = data[key];

            if (props.required === true && item == null) {
                data[key] = undefined;
                returnValue.errors.push(`${key} is required`);
            } else if (item != null) {

                if ((props.type === 'array' && item.constructor.name !== 'Array') || (props.type !== 'array' && typeof item !== props.type)) {
                    returnValue.errors.push(`${key} has invalid type expected to be ${props.type}`)
                } else if (props.validation != null) {
                    const v = await props.validation(item);
                    if (v != null) returnValue.errors.push(...v);
                }
                returnValue.data[key] = item;
            }

            returnValue.valid = returnValue.errors.length === 0;
        })

        return returnValue;
    }
}

type validatedData<T> = {
    data: T,
    errors: (string)[],
    valid: boolean
}