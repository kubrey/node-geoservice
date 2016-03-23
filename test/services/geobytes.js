"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../../configs"));
const expect = require("chai").expect;

var service = require(path.join(__dirname, "../../services/geobytes"));

console.log(conf.get('services:ip-api:requestOptions:host'));

describe("Testing geobytes", function () {
    before(function () {
        console.log('Start...');
    });
    it("Getting correct data for 8.8.8.8", function (done) {
        var ip = '8.8.8.8';

        service.lookup(ip, function (err, result) {
            try {
                expect(result).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Getting error for 8.8.88", function (done) {
        var ip = '8.8.8.888';
        service.lookup(ip, function (err, result) {
            console.log(result);
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Getting error for 0.0.0.0", function (done) {
        var ip = '0.0.0.0';
        service.lookup(ip, function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });


});
