"use strict";

const path = require('path');
const assert = require("chai").assert;
const expect = require("chai").expect;

var service = require(path.join(__dirname, "../../services/ipgeobase"));

describe("Testing ipgeobase", function () {
    before(function () {

    });
    it("Valid ip should get object as a result", function (done) {
        var ip = '8.8.8.8';
        service.lookup(ip, function (err, result) {
            try {
                expect(result).be.a('object');
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Invalid ip should get error", function (done) {
        var ip = '8.8.8';
        service.lookup(ip, function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Invalid ip should get error", function (done) {
        var ip = '8.8.8.888';
        service.lookup(ip, function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Invalid file should get error", function (done) {
        service.setParam('citiesdb', 'wrong-path');
        var ip = '8.8.8.8';
        service.lookup(ip, function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    })
});
