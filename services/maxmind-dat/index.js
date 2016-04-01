"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));
var geodatadir = conf.get('services:' + path.basename(path.dirname(__filename)) + ":directory");
global.geodatadir = geodatadir;

//console.log( conf.get('services:maxmind-dat:dbfile'));

var net = require('net');
var fs = require('fs');

/**
 *
 * @param geoResult
 * @param object extra
 * @return {{city: (*|string|null), countryCode: (*|string|string|string|null), countryName: null, regionName: null, regionCode: (string|*|null), zip: null, latitude: *, longitude: *, isp: null, method: *}}
 */
function formalize(geoResult, extra) {
    var lat = null, lon = null;
    geoResult = geoResult || {};
    if (geoResult.ll) {
        var coordsArr = geoResult.ll;
        lat = coordsArr[0];
        lon = coordsArr[1];
    }
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.country || null,
        countryName: null,
        regionName: null,
        regionCode: geoResult.region || null,
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
    lookup: function (ip, callback) {
        if (!net.isIP(ip)) {
            callback("Ip is invalid", null);
            return;
        }
        fs.exists(global.geodatadir, function (status) {
            if (!status) {
                callback("no such file or directory: " + geodatadir, null);
                return;
            }
            var geoip = require('geoip-lite');
            var start = new Date();
            var result = geoip.lookup(ip);
            if (result === null) {
                callback("Nothing found", null);
                return;
            }
            var extra = {requestTime: new Date() - start};
            callback(null, formalize(result, extra));
        });

    },
    setParam: function (key, pathVal) {
        var possibleKeys = conf.get('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
        if (typeof possibleKeys === 'object') {
            if (possibleKeys.indexOf(key) !== -1) {

                global.geodatadir = pathVal;
            }
        } else {
            global.geodatadir = pathVal;
        }
    }
};
