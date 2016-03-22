"use strict";

const path = require('path');
const assert = require("chai").assert;

var service = require(path.join(__dirname, "../../services/maxmind-dat"));

describe('Testing maxmind-dat', function () {
    before(function () {
        console.log('starting...');
    });
    it("basic ip check, result is object", function () {
        service.lookup('8.8.8.8', function (err, result) {
            //console.log(err, result);
            assert.isObject(result, "Data found");
        });
    });
    it("testing invalid ip", function () {
        service.lookup('888.8.8.8', function (err, result) {
            //console.log(err, result);
            assert.isNotNull(err, "Has some error");
        });
    });
});

