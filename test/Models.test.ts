import chai, { expect, should, assert } from "chai"
import Movie from "../src/models/Movie";
import Genere from "../src/models/Genere";
import { dbPath } from "../src/config/config";
import fs from "fs/promises"

async function getFileData() {
  return JSON.parse(await fs.readFile(dbPath, { encoding: "utf-8" }))
}

let baseData: any;

describe("Models", () => {

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

    describe("instance new", () => {
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

    describe('static find', () => {
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

    describe("static find by id", () => {
      let data: any;

      before(async () => {
        data = await Movie.find({ id: 8 })
      })

      it("has some data from file with id: 8", () => expect(data).to.deep.include({
        "id": 8,
        "title": "Memento",
        "year": "2000",
        "runtime": "113",
        "genres": ["Mystery", "Thriller"],
        "director": "Christopher Nolan",
        "actors": "Guy Pearce, Carrie-Anne Moss, Joe Pantoliano, Mark Boone Junior",
        "plot": "A man juggles searching for his wife's murderer and keeping his short-term memory loss from being an obstacle.",
        "posterUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
      }, "Don't have required data from file"))

      it("can get some params from model", () => {
        expect(data[0].year).to.equal("2000", "Error in value");
      })
    })

    describe('static methods', () => {

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
        const newModelData = {
          title: "new movie",
          year: "1995",
          runtime: "12345",
          director: "Jan Dzban 65",
          actors: "John update sange",
          plot: "Plot plot plot",
          id: 6,
        }

        const result = await Movie.update(newModelData, { id: 6 })
        const file = await getFileData();
        const finded = file.movies.find((el: { id: number; }) => el.id === 6)

        expect(result, "result can't be null").to.not.be.undefined;
        expect(file.movies).to.deep.contain(result, "file data don't have new record");
        expect(finded).to.be.deep.equal(result, "updated file isn't equal");

      })

      it("create", async () => {
        const newModelData = {
          title: "new movie",
          year: "1995",
          runtime: "12345",
          director: "Jan Dzban 2",
          actors: "John Holland 2",
          plot: "Plot plot plot",
        }

        const result = await Movie.create(newModelData)
        const file = await getFileData();

        expect(result, "result can't be null").to.not.be.undefined;
        expect(file.movies).to.deep.contain(result, "file data don't have new record");
      })

    })

  })
})