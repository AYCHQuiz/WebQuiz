process.env.NODE_ENV = "test";

const chai = require("chai");
chai.use(require("chai-http"));
const expect = chai.expect;
const app = require("../../server.js");

describe("server", () => {
    describe("GET /api/tags", () => {
        it("should return all tags", (done) => {
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
        it("should return all if no filter given", (done) => {
            chai.request(app)
            .get("/api/count_questions")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.equal(5);
                done();
            });
        });

        it("should return one for automobile", (done) => {
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

    describe("GET /api/tags_with_count", () => {
        it("should return total count for each tag if no filter given", (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    expect(pair.tag).to.be.a("string");
                    expect(pair.count).to.equal(1);
                });
                expect(res.body.data.total).to.equal(5);
                done();
            });
        });

        it("should only return 1 for animals", (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .query({"tags": "animals"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    if(pair.tag === "animals") {
                        expect(pair.count).to.equal(1);
                    } else {
                        expect(pair.count).to.equal(0);
                    }
                });
                expect(res.body.data.total).to.equal(1);
                done();
            });
        });

        it("should give 0 for invalid tag combination", (done) => {
            chai.request(app)
            .get("/api/tags_with_count")
            .query({tags: "animals|development"})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data.tags).to.have.length.of.at.least(1);
                res.body.data.tags.forEach((pair) => {
                    expect(pair.count).to.equal(0);
                });
                expect(res.body.data.total).to.equal(0);
                done();
            });
        });
    });

    describe("GET /api/quiz", () => {
        it("should return all if no filter given", (done) => {
            chai.request(app)
            .get("/api/quiz")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.status).to.equal("success");
                expect(res.body.data).to.have.lengthOf(5);
                done();
            });
        });
    });

    describe("GET /api/math/tex/svg", () => {
        it("should return SVG for simple math", function(done) {
            this.timeout(5000);
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

        it("should fail if no input given", (done) => {
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
