"use strict";

var path = require('path');
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));


function Ipinfo() {
    BaseService.call(this);
}

util.inherits(Ipinfo, BaseService);


Ipinfo.prototype.method = path.basename(path.dirname(__filename));
Ipinfo.prototype.loadConfigs();

/**
 *
 * @param geo
 * @return {{city: (*|string|null), countryCode: (*|string|string|string|null), countryName: null, regionName: (string|*|null), zip: (*|null), latitude: *, longitude: *, isp: (*|null), method: *}}
 */
Ipinfo.prototype.formalize = function (geo) {
    var lat = null, lon = null;
    try {
        var geoResult = JSON.parse(geo);
    } catch (e) {
        geoResult = {};
    }
    if (geoResult.loc) {
        var coordsArr = geoResult.loc.split(',');
        lat = coordsArr[0];
        lon = coordsArr[1];
    }
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.country || null,
        countryName: null,
        regionName: geoResult.region || null,
        regionCode: null,
        zip: geoResult.postal || null,
        latitude: lat,
        longitude: lon,
        isp: geoResult.org || null,
        method: this.method
    };

    return result;
};

Ipinfo.prototype.lookup = function (ip, callback) {
    BaseService.prototype.lookup.call(this, ip, callback);
};


module.exports = {
    lookup: function (ip, callback) {
        Ipinfo.prototype.lookup(ip, callback);
    },
    formalize: function (data) {
        return Ipinfo.prototype.formalize(data);
    }
};

