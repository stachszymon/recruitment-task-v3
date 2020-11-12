import chai, { expect, should, assert } from "chai"
import Movie from "../src/models/Movie";
import Genere from "../src/models/Genere";
import { dbPath } from "../src/config/config";
import fs from "fs/promises"
import ValidationError from "../src/utils/ValidationError";

async function getFileData() {
  return JSON.parse(await fs.readFile(dbPath, { encoding: "utf-8" }))
}

describe("Models", () => {

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

  describe('Movie', () => {

    describe("new", () => {
      const newMovie = new Movie({});

      const stringToPut = "Test Value";

      it("new model instance", () => {
        expect(newMovie).to.be.be.instanceOf(Movie)
      })

      it("getting and setting is working", () => {
        newMovie.test = stringToPut;
        expect(newMovie.test).to.be.equal(stringToPut);
      })

      it('save method is function', () => {
        expect(newMovie.save).to.be.a('function')
      })

      it("saving incorrect data", async () => {
        //expect(newMovie.save).to.throw() Don't work :(
        let isError = false;

        try {
          await newMovie.save();
        } catch (e) {
          isError = true;
        }

        expect(isError).to.be.equal(true);
      })

      it("saving correct data", async () => {

        const newModelData = {
          title: "new movie",
          year: "1995",
          runtime: "123",
          director: "Jan Dzban",
          actors: "John Holland",
          plot: "Plot plot plot",
        }

        newMovie.setData(newModelData);

        const savedModel = await newMovie.save(),
          fileData = await getFileData();

        expect(fileData.movies[fileData.movies.length - 1]).to.include(savedModel.getData(), "Don't have required data from file")
      })
    })

    describe('@find', () => {
      let data: any;
      before(async () => {
        data = await Movie.find();
      })

      it("not null", () => expect(data).to.not.be.undefined)
      it("is array or object", () => assert(Array.isArray(data) || assert.isObject(data), "is not array neither object"))
      it("has some data from file", () => expect(data).to.deep.include({
        "id": 6,
        "title": "Ratatouille",
        "year": "2007",
        "runtime": "111",
        "genres": ["Animation", "Comedy", "Family"],
        "director": "Brad Bird, Jan Pinkava",
        "actors": "Patton Oswalt, Ian Holm, Lou Romano, Brian Dennehy",
        "plot": "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.",
        "posterUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SX300.jpg"
      }, "Don't have required data from file"))

    })

    describe("@find by id", () => {
      let data: any;

      before(async () => {
        data = await Movie.find({ id: 6 })
      })

      it("has some data from file with id: 6", () => expect(data).to.deep.include({
        "id": 6,
        "title": "Ratatouille",
        "year": "2007",
        "runtime": "111",
        "genres": ["Animation", "Comedy", "Family"],
        "director": "Brad Bird, Jan Pinkava",
        "actors": "Patton Oswalt, Ian Holm, Lou Romano, Brian Dennehy",
        "plot": "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.",
        "posterUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SX300.jpg"
      }, "Don't have required data from file"))

      it("can get some params from model", () => {
        expect(data[0].year).to.equal("2007", "Error in value");
      })
    })

    it("delete", async () => {
      const param = { id: 6 };
      let result: any = [];

      before(async () => {
        await Movie.delete(param);
        result = await Movie.find(param);
      })

      expect(result.length).to.be.equal(0, "should have no result");
    })

    it("update", async () => {

    })

    it("create", async () => {

    })

  })
})