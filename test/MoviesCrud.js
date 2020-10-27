const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../build/index");

chai.use(chaiHttp);
chai.should();

describe("Movies", () => {
  describe("GET /", () => {
    it("should get all movies", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});
