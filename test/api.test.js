process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-http"));
const expect = chai.expect;
const app = require("../server.js");

describe("server", () => {
    describe("GET /api/tags", () => {
        it("should return all tags", done => {
            chai.request(app)
            .get("/api/tags")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.include("math");
                expect(res.body.data).to.include("automobile");
                expect(res.body.data).to.include("development");
                done();
            });
        });
    });

    describe("GET /api/count_questions", () => {
        it("should return all if no filter given", done => {
            chai.request(app)
            .get("/api/count_questions")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.equal(3);
                done();
            });
        });

        it("should return one for automobile", done => {
            chai.request(app)
            .get("/api/count_questions")
            .query({tags: "automobile"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.equal(1);
                done();
            });
        });
    });

    describe("GET /api/quiz", () => {
        it("should return all if no filter given", done => {
            chai.request(app)
            .get("/api/quiz")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.have.lengthOf(3);
                done();
            });
        });
    });

    describe("GET /api/math/tex/svg", () => {
        it("should return SVG for simple math", done => {
            chai.request(app)
            .get("/api/math/tex/svg")
            .query({input: "1+1"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header("content-type", /^image\/svg\+xml/);
                expect(res.body.length).to.be.above(0);
                done();
            });
        });

        it("should fail if no input given", done => {
            chai.request(app)
            .get("/api/math/tex/svg")
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("fail");
                done();
            });
        });
    });
});
