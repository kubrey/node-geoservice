"use strict";

var mmdbreader = require('maxmind-db-reader');
var path = require('path');
var conf = require(path.join(__dirname, "../../configs"));
var net = require('net');
var db = conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
var debug = require('debug')(conf.getVal('projectName') + ":services:maxmind-mmdb");
if (!path.isAbsolute(db)) {
    //path is relative to the app's root
    db = path.join(__dirname, "../../../", db);
}

function lookup(ip, callback) {
    if (!net.isIP(ip)) {
        callback("Invalid IP", null);
        return;
    }

    var start = new Date();
    mmdbreader.open(db, function (err, geoip) {
        if (err) {
            callback("Method error", null);
            return;
        }
        try {
            geoip.getGeoData(ip, function (err, geodata) {
                var extra = {requestTime: new Date() - start};
                callback(err, formalize(geodata, extra));
            });
        } catch (e) {
            callback(e.message, null);
        }
    });
}

function formalize(geoResult, extra) {
    var lat = null, lon = null;
    geoResult = geoResult || {};
    if (geoResult.location) {
        lat = geoResult.location.latitude;
        lon = geoResult.location.longitude;
    }
    var obj = {
        city: geoResult.city ? (geoResult.city.names.en) : null,
        countryCode: geoResult.country ? geoResult.country.iso_code : null,
        countryName: geoResult.country ? geoResult.country.names.en : null
    };
    var result = {
        city: obj.city,
        countryCode: obj.countryCode,
        countryName: obj.countryName,
        regionName: null,
        regionCode: null,
        zip: null,
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
    lookup: lookup,
    setParam: function (key, pathVal) {
        var possibleKeys = conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
        if (typeof possibleKeys === 'object') {
            if (possibleKeys.indexOf(key) !== -1) {
                //unused for this method, written for unification
            }
        } else {
            debug("setting path as " + pathVal);
            db = pathVal;
        }

    }
};


