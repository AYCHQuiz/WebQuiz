"use strict";
const strokeRegex = /stroke="currentColor"/g;
const fillRegex = /fill="currentColor"/g;

/**
 * Removes stroke and fill attributes with the value 'currentColor' as
 * emitted by MathJax. This attribute value is not standards-compliant
 * and prevented some image viewers from rendering the SVG correctly.
 * For 'stroke' and 'fill' the default color is 'black' anyway.
 *
 * You may remove this file once Mathjax fixes this weird color value or
 * makes it configurable.
 *
 * @param {String} svg String of SVG as emitted by Mathjax
 * @returns {String} String of SVG with removed weird stroke/fill attributes
 */
module.exports = (svg) => {
    return svg
        .replace(strokeRegex, "")
        .replace(fillRegex, "");
};
