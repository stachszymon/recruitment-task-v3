import { dbPath } from './../config/config';
import { IDatabaseHandler, IDatabaseHandlerContructor, DBStruct } from "../interfaces/IDatabaseHandler";
import fs from "fs/promises"

const DBFileSyncHandler: IDatabaseHandlerContructor = class DBFileSyncHandler implements IDatabaseHandler {

    private path: string;
    private data: DBStruct | undefined;

    constructor(path: string) {
        this.path = path;
        this.data = undefined;
    }

    /**
     * Read file and cache file content
     */
    public async read(): Promise<DBStruct> {
        if (this.data != null) {
            return this.data;
        }

        try {
            const fileData = await fs.readFile(this.path, { encoding: "utf-8" });
            return this.data = JSON.parse(fileData);
        } catch (err) {
            throw err;
        }
    }

    public async append(modelName: string, data: object): Promise<void> {
        const memo = await this.getData(),
            model = memo[modelName];

        model.push(data);

        await this.write(memo);
    }

    public async delete(modelName: string, param: object): Promise<void> {
        const data = await this.getData(),
            model = data[modelName],
            entries = Object.entries(param)

        if (entries.length === 0) return;

        const modelIndex = model.findIndex(el => entries.some(([k, v]) => el[k] != null && el[k] == v));

        if (modelIndex) {
            delete model[modelIndex];
        }

        await this.write(data);
    }

    private write(data: DBStruct): Promise<void> {
        return fs.writeFile(dbPath, JSON.stringify(data), { encoding: "utf-8" })
    }

    private async getData() {
        return this.data == null ? await this.read() : this.data;
    }

}

export default DBFileSyncHandler;