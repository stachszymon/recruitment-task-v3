import { DBStruct } from './../src/interfaces/IDatabaseHandler';
import { dbPath } from "../src/config/config";
import chai, { expect } from "chai";
import db from "../src/utils/db"
import fs from "fs/promises";
import { abort } from 'process';


describe("Database Reader", () => {

    let baseData: any;
    before(async () => {
        try {
            baseData = await fs.readFile(dbPath, { encoding: 'utf-8' })
        } catch (e) {
            console.error(e)
        }
    })

    after(async () => {
        try {
            await fs.writeFile(dbPath, baseData);
        } catch (e) {
            console.error(e)
        }
    })

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

    describe("delete", () => {
        let data: DBStruct;

        before(async () => {
            await db.delete("movies", { id: 146 })
            data = await db.read();
        })

        it("is removing from file", () => {
            expect(data.movies[data.movies.length - 1]).is.undefined;
        })
    })

    describe("append", () => {
        let data: DBStruct;

        before(async () => {
            await db.append('movies', { id: "test", test: "success" });
            data = await db.read();
        })

        it("expect to have new data in file", () => {
            expect(data.movies[data.movies.length - 1]).contain({ id: "test" }, 'incorrect data')
        })
    })
})