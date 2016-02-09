"use strict";

var geo = require("./app");

geo.lookup('8.8.8.8', function (err, result) {
    console.log(err, result);
});
