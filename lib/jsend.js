"use strict";
/**
 * JSend helper functions
 * https://labs.omniti.com/labs/jsend
 *
 * @param {Response} res Express HTTP Response object
 *
 * @example
 * const jsend = require("jsend");
 * // send success with data
 * jsend(res).data({count: 0});
 * // send error message
 * jsend(res).data("Internal Server Error");
 */
module.exports = (res) => {
    return {
        success: (data) => {
            res.json({status: "success", data});
        },
        fail: (data) => {
            res.status(400).json({status: "fail", data});
        },
        error: (message) => {
            res.status(500).json({status: "error", message});
        }
    };
};
