"use strict";

var assert = require("chai").assert;
var expect = require("chai").expect;
var geo = require('../lib/geosearch');

var ipv6 = '2601:9:7680:363:75df:f491:6f85:352f';
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
        this.timeout(5000);
        geo.lookup('8.8.8.888', function (err, result) {
            try {
                expect(err).to.be.an.instanceof(Error);
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
                expect(err).to.be.an.instanceof(Error);
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
    it("Setting all fields as required for a difficult ip - response must be empty", function (done) {
        geo.resetOptions();
        this.timeout(5000);
        geo.setOptions({
            fields: {
                "city": true,
                "countryCode": true,
                "countryName": true,
                "latitude": true,
                "longitude": true,
                "isp": true,
                "zip": true,
                "regionName": true,
                "regionCode": true
            }
        });
        geo.lookup('10.10.10.10', function (err, result) {
            try {
                expect(err).to.be.an.instanceof(Error);
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
                expect(err).to.be.an.instanceof(Error);
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
                expect(err).to.be.an.instanceof(Error);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Multiple runs test + resetting options", function (done) {
        geo.resetOptions();
        geo.lookup('8.8.8.8', function (err, result) {
            if (result) {
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

    it("Test Ipv6  + should return smth", function (done) {
        geo.lookup(ipv6, function (err, result) {
            try {
                expect(result).is.a('object');
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it("Test Ipv6 with disabled methods supporting ipv6 - should return error", function (done) {
        this.timeout(15000);
        geo.setOptions({
            services: {
                'maxmind-dat': false,
                'maxmind-mmdb': false,
                'ipinfo': false
            }
        });
        geo.lookup(ipv6, function (err, result) {
            try {
                //expect(err).not.equal(null);
                expect(err).to.be.an.instanceof(Error);
                done();
            } catch (e) {
                done(e);
            }
        });
    });


});