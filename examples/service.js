"use strict";

var geo = require('../lib/geosearch');
var ip = process.argv[2] || '8.8.8.8';
var options = {
    services: {
        'maxmind-dat': false,
        'maxmind-mmdb': false,
        'ipgeobase': 1,
        'geobytes': false,
        'freegeoip': false,
        'ip-api': false,
        'ipinfo': false
    }
};

var b = new Buffer('test');
console.log(b.length);
geo.setOptions(options);
geo.lookup(ip, function (err, res) {
    if(err){
        console.log(err.message);
        return;
    }
    console.log(err, res);
});

