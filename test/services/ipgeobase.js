"use strict";

const path = require('path');
const assert = require("chai").assert;

var service = require(path.join(__dirname, "../../services/ipgeobase"));

describe("Testing ipgeobase", function () {
    before(function () {
        console.log('Starting...');
    });
    it("Valid ip should get object as a result", function () {
        service.lookup('5.135.211.181', function (err, result) {
            console.log(err, result);
            assert.isObject(result, "Result is object");
        });
    })
});
