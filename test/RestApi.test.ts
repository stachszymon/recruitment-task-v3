import chai, { expect, assert } from "chai"
import chaiHttp from "chai-http";
import app from "../src/index";

const should = chai.should();

chai.use(chaiHttp);

describe("RestApi", () => {

    describe.only("/POST movie", () => {

        it('should create new movie', done => {
            chai.request(app)
                .post("/movie")
                .send({
                    title: "new movie",
                    year: "1995",
                    runtime: "12345",
                    director: "Jan Dzban 2",
                    actors: "John Holland 2",
                    plot: "Plot plot plot",
                }).end((err, res) => {
                    res.should.have.status(201);
                    done();
                })

        })

    })

    describe("/GET movie", () => {

        it("should get list of movies", (done) => {
            chai.request(app)
                .get("/movie")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(0);
                    done();
                })
        })

    })

})