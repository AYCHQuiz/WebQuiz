"use strict";
const helmet = require("helmet");

module.exports = (app) => {
    app.use(helmet.contentSecurityPolicy({
        directives: {
            baseUri: ["'self'"],
            defaultSrc: ["'none'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["*"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
        },
    }));
    app.use(helmet.frameguard({
        action: "deny",
    }));
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
};
