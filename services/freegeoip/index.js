"use strict";

var path = require('path');
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));


function FreegeoIp() {
    BaseService.call(this);
}

util.inherits(FreegeoIp, BaseService);


FreegeoIp.prototype.method = path.basename(path.dirname(__filename));
FreegeoIp.prototype.loadConfigs();

/**
 *
 * @param geoResult
 * @param object extra additional info to inject into result object
 * @return {{city: (*|string|null), countryCode: (*|string|string|string|null), countryName: null, regionName: (string|*|null), zip: (*|null), latitude: *, longitude: *, isp: (*|null), method: *}}
 */
FreegeoIp.prototype.formalize = function (geo, extra) {
    try {
        var geoResult = JSON.parse(geo);
    } catch (e) {
        geoResult = {};
    }
    geoResult = geoResult || {}
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.country_code || null,
        countryName: geoResult.country_name || null,
        regionName: geoResult.region_name || null,
        regionCode: geoResult.region_code || null,
        zip: geoResult.zip_code || null,
        latitude: geoResult.latitude,
        longitude: geoResult.longitude,
        isp: null,
        method: this.method
    };
    if (typeof extra === 'object') {
        for (var el in extra) {
            result[el] = extra[el];
        }
    }
    return result;
};

FreegeoIp.prototype.lookup = function (ip, callback) {
    BaseService.prototype.lookup.call(this, ip, callback);
};


module.exports = {
    lookup: function (ip, callback) {
        FreegeoIp.prototype.lookup(ip, callback);
    }
};
