"use strict";

var path = require('path');
var conf = require(path.join(__dirname, "../../configs"));
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));
const http = require('http')


function Ipinfo() {
    BaseService.call(this);
}

util.inherits(Ipinfo, BaseService);


Ipinfo.prototype.method = path.basename(path.dirname(__filename));
Ipinfo.prototype.loadConfigs();

//
console.log(123, Ipinfo.method);


module.exports = {
    lookup: function (ip, callback) {
        Ipinfo.prototype.lookup(ip, callback);
    }
};

