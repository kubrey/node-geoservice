"use strict";

var options = {};
options.services = [];
options.fields = [];
options.common = [];
//options.common.checkLevel = 'fdds';
//options.common.checkField = 'wrwe';
//options.services['ip-api'] = false;
var geo = require("./app");

geo.setOptions(options);

console.log(parseInt('34'));

//geo.lookup('8.8.8.8', function (err, result) {
//    console.log(err, result);
//});

setTimeout(function () {
    //options.services['ip-api'] = true;
    geo.setOptions({services: []});
    geo.lookup('95.173.136.72', function (err, result) {
        console.log(err, result);
    });
}, 2000);


//var a = {};
//if (a.length) {
//    console.log('yeah');
//}
