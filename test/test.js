"use strict";

var assert = require("chai").assert;
var geo = require('../app');

//
//
describe('Geolocator common function', function () {
    before(function () {
        console.log('starting...');
    });
    it("getting ip data as object(valid ip)", function () {
        geo.lookup('8.8.8.8', function (err, result) {
            //console.log(err,result);
            assert.isObject(result, "Return object");
            //assert.isNull(err,true,"No error");
        });
    });
    it("getting no error on valid ip", function () {
        geo.lookup('8.8.8.8', function (err, result) {
            //console.log(err,result);
            assert.isNull(err, "No error");
        });
    });
    it("getting error because of invalid ip", function () {
        geo.lookup('8.8.8.888', function (err, result) {
            console.log(err);
            assert.isNotNull(err, "Got error");
        });
    });
    it("getting error because no methods are allowed", function () {
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
            console.log(err);
            assert.isNotNull(err, "Got error");
        });
    });

    it("Setting invalid service name for valid ip - service should be ignored", function () {
        geo.setOptions({
            services: {
                'wrong': false
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            //console.log(err,result);
            assert.isNull(err, "No errors");
        });
    });
    it("Setting invalid field name for valid ip - field should be ignored", function () {
        geo.setOptions({
            fields: {
                wrong: true
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            assert.isNull(err, "No errors");
        });
    });
    it("Setting invalid common option for valid ip - option should be ignored", function () {
        geo.setOptions({
            common: {
                wrong: 23
            }
        });
        geo.lookup('8.8.8.8', function (err, result) {
            assert.isNull(err, "No errors");
        });
    });

});