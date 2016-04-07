"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../../lib/configs"));
const expect = require("chai").expect;

var service = require(path.join(__dirname, "../../lib/services/ip-api"));

console.log(conf.get('services:ip-api:requestOptions:host'));

describe("Testing ip-api", function () {
    before(function () {
        console.log('Start...');
    });
    it("Getting correct data for 8.8.8.8", function (done) {
        var ip = '8.8.8.8';
        var path = conf.get('services:ip-api:requestOptions:path').replace('{{ip}}', ip);

        service.lookup(ip, function (err, result) {
            try {
                expect(result).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Getting error for 8.8.8.888", function (done) {
        var ip = '8.8.88';
        service.lookup(ip, function (err, result) {
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
