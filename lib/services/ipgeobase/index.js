"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));
var helper = require(path.join(__dirname, "../../helpers"));
var cidr = path.join(__dirname, "../../", conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":cidrdb"));
var cities = path.join(__dirname, "../../", conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":citiesdb"));

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
    var instream = fs.createReadStream(cidr);
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
    //callback(null,{});
    rl.on('line', function (line) {
        //console.log(line);

        var lineRow = line.split("\t");
        var long = helper.ip2long(ip);
        if (long >= lineRow[0] && long <= lineRow[1]) {
            if (isNaN(parseInt(lineRow[4]))) {
                found = true;
                rl.close();
                var extra = {requestTime: new Date() - start};
                callback(null, formalize({
                    countryCode: lineRow[3],
                    method: path.basename(path.dirname(__filename))
                }, extra));


            } else {
                findDetailedData({countryCode: lineRow[3], id: parseInt(lineRow[4]), start: start}, callback);
                found = true;
                rl.close();
            }

        }
    });
    rl.on('close', function () {
        if (!found) {
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
    validate(ip)
        .then(status=> {
            return helper.isFile(cidr)
        })
        .then((res)=> {
            return helper.isFile(cities);
        })
        .then(res=> {
            findCountry(ip, callback);
        }).catch(err=> {
            callback(err);
        });
}


function validate(ip) {
    return new Promise((resolve, reject) => {
            var ipv6Enabled = conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":v6");
            var check = net.isIP;
            if(!ipv6Enabled){
                check = net.isIPv4;
            }
            if (!check(ip)) {
                reject(ip + " is not valid IP");
            } else {
                resolve(true);
            }
        }
    );
}

/**
 *
 * @param path
 * @return {Promise}
 */
function isFileValid(path) {
    return new Promise((resolve, reject)=> {
        fs.stat(path, (err, stats)=> {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    })
}


module.exports = {
    lookup: lookup,
    setParam: function (key, pathVal) {
        var possibleKeys = conf.getVal('services:' + path.basename(path.dirname(__filename)) + ":dbfile");
        if (typeof possibleKeys === 'object') {
            if (possibleKeys.indexOf(key) !== -1) {
                if (key === 'cidrdb') {
                    cidr = pathVal;
                } else if (key === 'citiesdb') {
                    cities = pathVal;
                }
            }
        }
    }
};