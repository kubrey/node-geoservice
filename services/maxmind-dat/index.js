"use strict";

var geoip = require('geoip-lite');
var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));
var net = require('net');
var fs = require('fs');

var geodatafile = conf.get('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
global.geodatadir = path.dirname(geodatafile);

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
        var start = new Date();
        var result = geoip.lookup(ip);
        if (result === null) {
            callback("Nothing found", null);
            return;
        }
        var extra = {requestTime: new Date() - start};
        callback(null, formalize(result, extra));
    }
};
