import db from "./db";

export default class Model {

    private schema: Schema | Schemas;
    private dbName: string;

    constructor(name: string, schema: Schema | Schemas) {
        this.dbName = name;
        this.schema = schema;
    }

    static find() {

    }

    static delete() {

    }

    static update() {

    }

    static save() {

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