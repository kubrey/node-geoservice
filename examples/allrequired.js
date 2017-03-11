"use strict";

var geo = require('../lib/geosearch');
var ip = process.argv[2] || '8.8.8.8';
var options = {
    fields: {
        "city": true,
        "countryCode": true,
        "countryName": true,
        "latitude": true,
        "longitude": true,
        "isp": true,
        "zip": true,
        "regionName": true,
        "regionCode": true
    }

};
geo.setOptions(options);
geo.lookup(ip, function (err, res) {
    //instanceof err;
    console.log(err instanceof Error, res);
});
