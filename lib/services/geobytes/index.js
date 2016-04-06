"use strict";

var path = require('path');
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));


function Geobytes() {
    BaseService.call(this);
}

util.inherits(Geobytes, BaseService);


Geobytes.prototype.method = path.basename(path.dirname(__filename));
Geobytes.prototype.loadConfigs();

Geobytes.prototype.formalize = function (geo, extra) {
    try {
        var geoResult = JSON.parse(geo);
    } catch (e) {
        geoResult = {};
    }
    geoResult = geoResult || {}
    var result = {
        city: geoResult.geobytescity || null,
        countryCode: geoResult.geobytesinternet || null,
        countryName: geoResult.geobytescountry || null,
        regionName: geoResult.geobytesregion || null,
        regionCode: geoResult.geobytescode || null,
        zip: null,
        latitude: geoResult.geobyteslatitude || null,
        longitude: geoResult.geobyteslongitude || null,
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

Geobytes.prototype.lookup = function (ip, callback) {
    BaseService.prototype.lookup.call(this, ip, callback);
};

module.exports = {
    lookup: function (ip, callback) {
        Geobytes.prototype.lookup(ip, callback);
    }
};