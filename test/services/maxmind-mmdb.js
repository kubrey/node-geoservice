"use strict";

const path = require('path');
const expect = require("chai").expect;
var service = require(path.join(__dirname, "../../services/maxmind-mmdb"));
var conf = require(path.join(__dirname, "../../configs"));

describe('Testing maxmind-dat', function () {
    before(function () {

    });
    it("basic ip check, result should be object, err = null", function (done) {
        service.lookup('8.8.8.8', function (err, result) {
            console.log(result);
            try {
                expect(result).be.a('object');
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("testing invalid ip", function (done) {
        service.lookup('888.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("testing invalid ip", function (done) {
        conf.set('services:maxmind-mmdb:dbfile', "/var/www/");//wrong path
        service.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

});

