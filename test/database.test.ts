import { dbPath } from "../src/config/config";
import chai, { expect } from "chai";
import db from "../src/utils/db"
import fs from "fs/promises";


describe("Database Reader", () => {

    describe("read()", () => {
        let fileData: Object;
        let dbHandlerData: any;

        before(async () => {
            await Promise.all([
                fs.readFile(dbPath, { encoding: "utf-8" }),
                db.read()
            ]).then(
                ([file, handler]) => {
                    fileData = JSON.parse(file);
                    dbHandlerData = handler;
                }
            )
        })


        it("data from dbHandler not null", () => {
            expect(dbHandlerData).to.not.be.undefined;
        })

        it("data from db handler is object", () => {
            expect(dbHandlerData).to.be.an('object');
        })

        it("data from db handler has 'genres' and 'movies'", () => {
            expect(dbHandlerData).to.have.property('genres')
            expect(dbHandlerData).to.have.property('movies')
        })

        it("data from db is equal to this in file", () => {
            expect(dbHandlerData).to.be.deep.equal(fileData);
        })

    })
})