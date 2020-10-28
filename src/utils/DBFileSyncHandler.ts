import fs from "fs/promises"
import { IDatabaseHandler, IDatabaseHandlerContructor } from "../interfaces/IDatabaseHandler";

const DBFileSyncHandler: IDatabaseHandlerContructor = class DBFileSyncHandler implements IDatabaseHandler {

    private path: string;
    private data: Array<object> | object;

    constructor(path: string) {
        this.path = path;
        this.data = [];
    }

    read(): Promise<Array<object>> {
        return fs.readFile(this.path, {
            encoding: "utf-8"
        })
            .then(value => {
                console.log(value);
                return [];
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }


    write(): Promise<boolean> {
        return new Promise(resolve => {
            resolve(true)
        });
    }

    append(): Promise<boolean> {
        return new Promise(resolve => {
            resolve(true)
        });
    }

    delete(): Promise<boolean> {
        return new Promise(resolve => {
            resolve(true)
        });
    }

}

export default DBFileSyncHandler;