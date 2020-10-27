import path from "path";
import fs from "fs/promises"
import dbReader from "./DBFileSyncReader";

const dbPath = path.resolve("./data/db.json")
const test = path.resolve("./data/test.txt")

const reader = new dbReader(test);

console.log(dbPath);

export async function readData() {
    //     fs.readFile(dbPath)
    //         .then(value => {
    //             console.log(value);
    //         })
    //         .catch(console.error);

    // fs.open(dbPath, 'r+')
    //     .then(value => {
    //         console.log(value)
    //     })
    //     .catch(console.error)

    fs.appendFile(test, "Line1", {
        // flag: "w"
    })
        .then(x => {
            console.log("line1 finish")


        })
        .catch(console.error)

    fs.appendFile(test, "Line2", {
        // flag: "w"
    })
        .then(x => {
            console.log("line2 finish")
        })
        .catch(console.error)
}
