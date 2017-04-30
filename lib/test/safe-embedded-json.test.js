/* eslint-env mocha */
const expect = require("chai").expect;
const safeJsonStringify = require("../safe-embedded-json");

describe("safe-embedded-json", () => {
    it("should not touch safe strings", () => {
        const original = {
            "a": 5, "b": ["c", "d?"],
        };
        const result = safeJsonStringify(original);
        expect(JSON.parse(result)).to.deep.equal(original);
    });

    it("should escape evil </script>", () => {
        const original = {
            "a": "</script>",
        };
        const result = safeJsonStringify(original);
        expect(result).to.not.contain("</script>");
        expect(JSON.parse(result)).to.deep.equal(original);
    });

    it("should escape evil </ script>", () => {
        const original = {
            "a": "</ script>",
        };
        const result = safeJsonStringify(original);
        expect(result).to.not.contain("</ script>");
        expect(result).to.not.contain("</script>");
        expect(JSON.parse(result)).to.deep.equal(original);
    });

    it("should escape <!-- HTML comments -->", () => {
        const original = {
            "a": "<!--", "b": "-->",
        };
        const result = safeJsonStringify(original);
        expect(result).to.not.contain("<!--");
        expect(result).to.not.contain("-->");
        expect(JSON.parse(result)).to.deep.equal(original);
    });
});
