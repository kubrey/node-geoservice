"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));
var helper = require(path.join(__dirname, "../../helpers"));
var cird = conf.get('services:' + path.basename(path.dirname(__filename)) + ":cidrdb");
var cities = conf.get('services:' + path.basename(path.dirname(__filename)) + ":citiesdb");

var fs = require('fs'),
    net = require('net'),
    readline = require('readline'),
    stream = require('stream');


/**
 *
 * @param geoResult
 * @param extra
 * @return {{city: (*|string|null), countryCode: (*|string|string|string|null), countryName: null, regionName: (string|*|null), regionCode: null, zip: null, latitude: (*|Number|null), longitude: (*|Number|null), isp: null, method}}
 */
function formalize(geoResult, extra) {
    var result = {
        city: geoResult.city || null,
        countryCode: geoResult.countryCode || null,
        countryName: null,
        regionName: geoResult.region || null,
        regionCode: null,
        zip: null,
        latitude: geoResult.latitude || null,
        longitude: geoResult.longitude || null,
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

/**
 *
 * @param ip
 * @param callback
 */
function findCountry(ip, callback) {
    var instream = fs.createReadStream(cird);
    var outstream = new stream;
    outstream.readable = true;
    outstream.writable = true;
    var start = new Date();
    var rl = readline.createInterface({
        input: instream,
        output: outstream,
        terminal: false
    });
    var found = false;
    rl.on('line', function (line) {
        //console.log(line);
        var lineRow = line.split("\t");
        var long = helper.ip2long(ip);
        if (long >= lineRow[0] && long <= lineRow[1]) {
            if (isNaN(parseInt(lineRow[4]))) {
                console.log('callback ipgeo1');
                var extra = {requestTime: new Date() - start};
                callback(null, formalize({
                    countryCode: lineRow[3],
                    method: path.basename(path.dirname(__filename))
                }, extra));

            } else {
                console.log('callback ipgeo');
                findDetailedData({countryCode: lineRow[3], id: parseInt(lineRow[4]), start: start}, callback);
            }
            found = true;
            rl.close();
        }
    });
    rl.on('close', function () {
        console.log(found);
        if (!found) {
            console.log('callback closing');
            callback("Country not found in ipgeobase", null);
        }
    });

}

/**
 *
 * @param found
 * @param callback
 */
function findDetailedData(found, callback) {
    var instreamCity = fs.createReadStream(cities);
    var outstream = new stream;
    outstream.readable = true;
    outstream.writable = true;
    var rlCity = readline.createInterface({
        input: instreamCity,
        output: outstream,
        terminal: false
    });
    rlCity.on('line', function (line) {
        var lineRow = line.split("\t");
        if (parseInt(lineRow[0]) == found.id) {
            var geo = {
                latitude: lineRow[4],
                longitude: lineRow[5],
                city: lineRow[1],
                region: lineRow[2],
                countryCode: found.countryCode,
                method: path.basename(path.dirname(__filename))
            };
            var extra = {requestTime: new Date() - found.start};
            callback(null, formalize(geo, extra));
        }
    });
    callback("City not found", null);
}

/**
 *
 * @param ip
 * @param callback
 */
function lookup(ip, callback) {
    if (!net.isIPv4(ip)) {
        callback("Only IPv4 allowed", null);
        return;
    }

    findCountry(ip, callback);
}


module.exports = {
    lookup: lookup
};