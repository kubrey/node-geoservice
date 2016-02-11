"use strict";

var geo = require("./app");
var options = {};
//options.services = [];
//options.services['ip-api'] = false;

geo.lookup('8.8.8.8', function (err, result) {
    console.log(err, result);
}, options);

setTimeout(function () {
    geo.lookup('95.153.83.246', function (err, result) {
        console.log(err, result);
    });
}, 2000);

