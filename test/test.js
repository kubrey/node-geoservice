"use strict";

var assert = require("chai").assert;
var expect = require("chai").expect;
var geo = require('../lib/geosearch');

//
//
describe('Geolocator common function', function () {
    before(function () {

    });
    it("getting ip data as object(valid ip)", function (done) {
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(result).be.a('object');
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("getting no error on valid ip", function (done) {
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(result).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("getting error because of invalid ip", function (done) {
        geo.lookup('8.8.8.888', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("getting error because no methods are allowed", function (done) {
        geo.setOptions({
            services: {
                'ip-api': false,
                'maxmind-dat': false,
                'maxmind-mmdb': false,
                'ipinfo': false,
                'freegeoip': false,
                'geobytes': false,
                'ipgeobase': false
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Setting invalid service name for valid ip - service should be ignored", function (done) {
        geo.setOptions({
            services: {
                'wrong': false
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).be.null;
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Setting invalid field name for valid ip - field should be ignored without error", function (done) {
        geo.setOptions({
            fields: {
                wrong: true
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).be.null;
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Setting invalid common option for valid ip - option should be ignored and no errors occurred", function (done) {
        geo.setOptions({
            common: {
                wrong: 23
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).be.null;
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    it("Setting invalid path to maxmind mmdb", function (done) {
        geo.setOptions({
            files: {
                "maxmind-mmdb": "wrong-path-of-mmdb-file"
            },
            services: {
                'ip-api': false,
                'maxmind-dat': false,
                'maxmind-mmdb': true,
                'ipinfo': false,
                'freegeoip': false,
                'geobytes': false,
                'ipgeobase': false
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Setting invalid path to maxmind dat", function (done) {
        geo.setOptions({
            files: {
                "maxmind-dat": {directory: "wrong-path-of-dat-file"}
            },
            services: {
                'ip-api': false,
                'maxmind-dat': true,
                'maxmind-mmdb': false,
                'ipinfo': false,
                'freegeoip': false,
                'geobytes': false,
                'ipgeobase': false
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            try {
                expect(err).not.equal(null);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Multiple runs test + resetting options", function (done) {
        geo.resetOptions();
        geo.lookup('8.8.8.8', function (err, result) {
            if(result){
                geo.lookup('18.18.18.18', function (err, result) {
                    try {
                        expect(result).not.equal(null);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            }
        });
    });



});