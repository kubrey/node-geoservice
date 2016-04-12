"use strict";

const path = require('path');
const expect = require("chai").expect;
var conf = require(path.join(__dirname, "../../lib/configs"));
//conf.set('services:maxmind-dat:directory', "/var/www/1");//wrong path

var service = require(path.join(__dirname, "../../lib/services/maxmind-dat"));

service.setParam('directory','wrong-path');

describe('Testing maxmind-dat dbfile', function () {
    before(function () {

    });

    it("invalid dbfile path", function (done) {
        service.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Valid path but not containing dat files - error", function (done) {
        service.setParam('directory','/var');
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



