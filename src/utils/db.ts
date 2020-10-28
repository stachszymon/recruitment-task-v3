import { IDatabaseHandler, IDatabaseHandlerContructor } from "../interfaces/IDatabaseHandler";
import { dbPath } from "../config/config";
import DBFileSyncHandler from "./DBFileSyncHandler";

function initHandler(handler: IDatabaseHandlerContructor): IDatabaseHandler {
    return new handler(dbPath)
}

const handler = initHandler(DBFileSyncHandler);

export default handler;