"use strict";

var options = {};
options.services = [];
options.fields = [];
options.common = [];
options.common.checkLevel = 8;
options.common.checkField = 'countryCode';
//options.services['ip-api'] = false;
var geo = require("./app");

geo.setOptions(options);


geo.lookup('8.8.8.8', function (err, result) {
    console.log('<<<<<<<<<<<<<<<>>>>>>>>>>>>>>');
    console.log(err, result);
});



var avgTime = 0, attempts = 0, fullTime = 0;
//setInterval(function () {
//    //options.services['ip-api'] = true;
//    //geo.setOptions({services: []});
//    geo.lookup('95.173.136.72', function (err, result) {
//        if (err) {
//            return;
//        }
//        ++attempts;
//        var clone = JSON.parse(JSON.stringify(result));
//        fullTime = parseInt(clone.requestTime) + fullTime;
//        avgTime = fullTime / attempts;
//        console.log(result.usedMethods, result.requestTime, avgTime, attempts);
//    });
//}, 100);


//var a = {};
//if (a.length) {
//    console.log('yeah');
//}
