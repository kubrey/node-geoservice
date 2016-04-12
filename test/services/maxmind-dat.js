"use strict";

const path = require('path');
const expect = require("chai").expect;
const service = require(path.join(__dirname, "../../lib/services/maxmind-dat"));
//service.setParam('directory','/var/www1/');

describe('Testing maxmind-dat', function () {
    before(function () {

    });
    it("basic ip check, result should be object, err = null", function (done) {
        service.lookup('8.8.8.8', function (err, result) {
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

});

