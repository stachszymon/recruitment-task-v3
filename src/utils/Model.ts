import IModel from "../interfaces/IModel"

export default class Model implements IModel {

    private schema: Schema | Schemas;
    private dbName: string;

    constructor(name: string, schema: Schema | Schemas) {
        this.dbName = name;
        this.schema = schema;
    }

    find() {

    }

    delete() {

    }

    update() {

    }

    save() {

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