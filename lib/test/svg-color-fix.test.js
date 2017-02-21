/* eslint-env mocha */
const expect = require("chai").expect;
const fixSvgColor = require("../svg-color-fix");

describe("svg-color-fix", () => {
    it("should remove stroke/fill with 'currentColor'", () => {
        const input = `
            <svg xmlns:xlink="http://www.w3.org/1999/xlink"
            width="8.976ex" height="2.676ex"
            style="vertical-align: -0.338ex;" viewBox="0 -1006.6 3864.5 1152.1"
            role="img" focusable="false" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" fill="currentColor" stroke-width="0"
                transform="matrix(1 0 0 -1 0 0)">
            <use xlink:href="#E1-MJMATHI-45" x="0" y="0"></use>
            <use xlink:href="#E1-MJMAIN-3D" x="1042" y="0"></use>
            <g stroke="currentColor" fill="currentColor">
            <use xlink:href="#E1-MJMATHI-6D" x="2098" y="0"></use>
            </g>
            </g>
            </svg>
        `;

        const output = fixSvgColor(input);

        expect(output).to.not.contain('stroke="currentColor"');
        expect(output).to.not.contain('fill="currentColor"');
        expect(output).to.contain('stroke-width="0"',
            "preserve similar named attributes");
    });
});
