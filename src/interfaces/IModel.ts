export interface IModel {
    new(data?: dataObject): IModelContruct
    find(param?: params): Promise<Array<object>>
    delete(param: params): Promise<void>
    update(data: object): Promise<undefined>
    create(data: object): Promise<object>
    [key: string]: any
}

export interface IModelContruct {
    save(): Promise<IModelContruct>
    getData(): dataObject
    setData(data: dataObject): IModelContruct
    [key: string]: any
}

export type dataObject = {
    id?: string | number | undefined
    [key: string]: string | number | Array<string | number> | undefined
}

export type params = {
    [key: string]: string | number
}