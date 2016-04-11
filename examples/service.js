"use strict";

var geo = require('../lib/geosearch');
var ip = process.argv[2] || '8.8.8.8';
var options = {
    services: {
        'maxmind-dat': false,
        'maxmind-mmdb': 1,
        'ipgeobase': false,
        'geobytes': false,
        'freegeoip': false,
        'ip-api':false,
        'ipinfo':false
    }
};
geo.setOptions(options);
geo.lookup(ip, function (err, res) {
    console.log(err, res);
});

