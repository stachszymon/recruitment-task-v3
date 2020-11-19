import chai, { expect, assert } from "chai"
import chaiHttp from "chai-http";
import app from "../src/index";

const should = chai.should();

chai.use(chaiHttp);

describe("RestApi", () => {

    describe("/POST movie", () => {

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

    describe.only("/GET movie", () => {

        it("no param: should get one random movie", (done) => {
            chai.request(app)
                .get("/movie")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.be.eql(undefined);

                    done();
                })
        })

        it("duration param: shoudl get on random movie between +/- 10 duration", (done) => {
            chai.request(app)
                .get("/movie")
                .query({
                    duration: 201
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.be.eql(undefined);
                    expect(Number(res.body.runtime)).to.be.below(212).above(190);

                    done();
                })
        })

        it("genere param: should get all movies with genere", (done) => {
            chai.request(app)
                .get("/movie")
                .query({
                    genres: ["Crime", "Drama"]
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(undefined);

                    expect(res.body.every((x: any) => x.genres.includes("Crime") || x.genres.includes("Drama"))).to.be.true;

                    done();
                })
        })

        it("all param: all movies with genere betwean duration", (done) => {
            chai.request(app)
                .get("/movie")
                .query({
                    duration: 201,
                    genres: ["Action", "Biography"]
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.not.be.eql(undefined);
                    expect(res.body.every((x: any) => {
                        const n = Number(x.runtime)
                        return n >= 191 && n <= 211
                    })).to.be.true;
                    expect(res.body.every((x: any) => x.genres.includes("Crime") || x.genres.includes("Drama"))).to.be.true;

                    done();
                })
        })

    })

})