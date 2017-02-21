"use strict";
const widthRegex = /(width)="([0-9\.]+)ex"/;
const heightRegex = /(height)="([0-9\.]+)ex"/;

/**
 * Fixes width and height attributes of SVG that use the `ex` unit as
 * emitted by Mathjax.
 *
 * For more information see https://github.com/tum-rt/web-quiz/issues/17
 *
 * @param {String} svg String of SVG as emitted by Mathjax
 * @param {Number} factor Ratio between `ex` and `pixel`, usually around 10
 * @returns {String} String of SVG with fixed width and height attributes
 */
module.exports = (svg, factor) => {
    const replaceFn = (_, attr, size) =>
        attr + '="' + Math.round(parseFloat(size) * factor) + '"';

    return svg
        .replace(widthRegex, replaceFn)
        .replace(heightRegex, replaceFn);
};
