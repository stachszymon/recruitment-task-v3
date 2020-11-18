export interface IModel {
    new(data?: dataObject): IModelContruct
    find(param?: params): Promise<Array<object | string | number>>
    delete(param: params): Promise<void>
    update(data: dataObject, params: params): Promise<object | string | number>
    create(data: dataObject): Promise<object | string | number>
    [key: string]: any
}

export interface IModelContruct {
    save(): Promise<IModelContruct>
    getData(): dataObject
    setData(data: dataObject): IModelContruct
    [key: string]: any
}

export type dataObjectRaw = {
    id?: string | number | undefined
    [key: string]: dataObjectValue
}

export type dataObject = dataObjectRaw | string | number

export type params = paramObject | string | number

export type paramObject = {
    [key: string]: string | number
}

export type Schema = {
    type: Types
    required?: boolean
    validation?: (value: any) => Promise<(string)[] | undefined> | (string)[] | undefined
}

export type Schemas = {
    [key: string]: Schema
}

export enum Types {
    String = "string",
    Number = "number",
    Array = "array"
}

export type dataObjectValue = string | number | Array<string | number> | undefined