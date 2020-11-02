import chai, { expect, should, assert } from "chai"
import Movie from "../src/models/Movie";
import Genere from "../src/models/Genere";

describe("Models", () => {
  describe('Movie', () => {

    describe('@find', () => {
      let data: any;
      before(async () => {
        data = await Movie.find();
      })

      it("not null", () => expect(data).to.not.be.undefined)
      it("is array", () => assert(Array.isArray(data) || assert.isObject(data), "is not array neither object"))
      it("has some data from file", () => expect(data).to.include({
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



    it("delete", async () => {
      // const data = Movie.find();
    })

    it("update", async () => {

    })

    it("create", async () => {

    })

  })
})