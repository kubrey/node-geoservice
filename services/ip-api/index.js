"use strict";

var path = require('path');
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));
const http = require('http')


function IpApi() {
    BaseService.call(this);
}

util.inherits(IpApi, BaseService);


IpApi.prototype.method = path.basename(path.dirname(__filename));
IpApi.prototype.loadConfigs();

/**
 *
 * @param geoResult
 * @param object extra
 * @return {{city: (*|string|null), countryCode: (*|string|string|string|null), countryName: null, regionName: (string|*|null), zip: (*|null), latitude: *, longitude: *, isp: (*|null), method: *}}
 */
IpApi.prototype.formalize = function (geo, extra) {
    try {
        var geoResult = JSON.parse(geo);
    } catch (e) {
        geoResult = {};
    }
    geoResult = geoResult || {}
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.countryCode || null,
        countryName: geoResult.country || null,
        regionName: geoResult.regionName || null,
        regionCode: geoResult.region || null,
        zip: geoResult.zip || null,
        latitude: geoResult.lat,
        longitude: geoResult.lon,
        isp: geoResult.isp || null,
        method: this.method
    };

    if (typeof extra === 'object') {
        for (var el in extra) {
            result[el] = extra[el];
        }
    }

    return result;
};

IpApi.prototype.lookup = function (ip, callback) {
    var options = util._extend({}, this.config.requestOptions);

    options.path = options.path.replace('{{ip}}', ip);
    options.timeout = 5000;
    var self = this;
    var start = new Date();
    var req = http.request(options, function (res) {
        self.requestTime = new Date() - start;
        var extra = {requestTime: self.requestTime};
        if (res.statusCode !== 200) {
            callback("status code " + res.statusCode, null);
            return;
        }
        res.setEncoding('utf8');
        var answer = '';
        res.on('data', function (chunk) {
            answer += chunk;
        }).on('end', function () {
            try {
                var json = JSON.parse(answer);
                if (json.status !== "success") {
                    throw Error(json.message);
                }
            } catch (e) {
                callback(util.inspect(e), null);
                return;
            }
            callback(null, self.formalize(answer, extra));
            //res.end();
        });
    }).on('error', function (err) {
        callback(err, null);
    });

    req.end();
};


module.exports = {
    lookup: function (ip, callback) {
        IpApi.prototype.lookup(ip, callback);
    }
};

