"use strict";

function GeoError(msg) {
    Error.call(this, msg) ;
    this.name = "GeoError";

    this.message = msg;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, GeoError);
    } else {
        this.stack = (new Error()).stack;
    }

}

GeoError.prototype = Object.create(Error.prototype);

module.exports = GeoError;