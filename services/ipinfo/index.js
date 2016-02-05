"use strict";

var path = require('path');
var conf = require(path.join(__dirname, "../../configs"));
var util = require('util');
var BaseService = require(path.join(__dirname, "../service"));

var ee = require('events');

console.log(BaseService);

function Ipinfo() {
    BaseService.call(this);
};

util.inherits(Ipinfo, BaseService);

//Ipinfo.prototype.method = path.basename(path.dirname(__filename));
//Ipinfo.prototype.loadConfigs();
//
//console.log(Ipinfo.prototype.config);
//
//var method = path.basename(path.dirname(__filename));
//var geoConf = conf.get('services:' + method);

