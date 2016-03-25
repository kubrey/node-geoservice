"use strict";

var mmdbreader = require('maxmind-db-reader');
var path = require('path');
var conf = require(path.join(__dirname, "../../configs"));
var net = require('net');

function lookup(ip, callback) {
    if (!net.isIP(ip)) {
        callback("Invalid IP", null);
        return;
    }
    var db = conf.get('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
    var start = new Date();
    console.log(db);
    mmdbreader.open(db, function (err, geoip) {
        if(err){
            callback("Method error",null);
            return;
        }
        geoip.getGeoData(ip, function (err, geodata) {
            var extra = {requestTime: new Date() - start};
            callback(err, formalize(geodata, extra));
        });
    });
}

function formalize(geoResult, extra) {
    var lat = null, lon = null;
    geoResult = geoResult || {};
    if (geoResult.location) {
        lat = geoResult.location.latitude;
        lon = geoResult.location.longitude;
    }
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.country.names.en || null,
        countryName: null,
        regionName: null,
        regionCode: null,
        zip: geoResult.country.iso_code || null,
        latitude: lat,
        longitude: lon,
        isp: null,
        method: path.basename(path.dirname(__filename))
    };

    if (typeof extra === 'object') {
        for (var el in extra) {
            result[el] = extra[el];
        }
    }

    return result;
}


module.exports = {
    lookup: lookup
};


