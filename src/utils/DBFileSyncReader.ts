import IDatabaseInterface from "../interfaces/IDatabaseFileReader";
import fs from "fs/promises"

export default class DBReaderSync implements IDatabaseInterface {

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

}