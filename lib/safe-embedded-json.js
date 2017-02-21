"use strict";
const slashRegex = /\//g;
const ltRegex = /</g;
const gtRegex = />/g;

/**
 * Replace </ by <\/ to prevent </script><script>alert('evil'); attack
 *
 * Embedding JSON in HTML script is usually safe except when JSON contains
 * a string with </script>. This will close the previous <script> tag and
 * would allow an attacker to insert arbitrary HTML (even other script tags).
 *
 * HTML comments <!-- --> can also break out of <script> tags.
 *
 * To prevent such attacks, '/', '<' and '>' must be escaped with their
 * corresponding JSON escape sequence.
 *
 * http://benalpert.com/2012/08/03/preventing-xss-json.html
 * http://stackoverflow.com/questions/7322682
 */
module.exports = (object) => {
    return JSON.stringify(object)
        .replace(slashRegex, "\\/")
        .replace(ltRegex, "\\u003c")
        .replace(gtRegex, "\\u003e");
};
