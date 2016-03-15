"use strict";

const path = require('path');
const assert = require("chai").assert;

var service = require(path.join(__dirname, "../../services/ipgeobase"));

describe("Testing ipgeobase", function () {
    before(function () {
        console.log('Start...');
    });
    it("Valid ip should get object as a result", function () {
        service.lookup('8.8.8.8', function (err, result) {
            assert.isObject(result, "Result is object");
        });
    });
    it("Invalid ip should get error", function () {
        service.lookup('8.8.8.888', function (err, result) {
            assert.notEqual(err,null, "Error is set");
        });
    });
    it("Invalid ip should get error", function () {
        service.lookup('8.8.8.888', function (err, result) {
            assert.notEqual(err,null, "Error is set");
        });
    })
});
