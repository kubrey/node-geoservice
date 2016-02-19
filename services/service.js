"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../configs"));
var http = require('http');
var util = require('util');

function BaseService() {
    this.method;
    this.config;
    this.requestTime;
    BaseService.call(this);
};
//
BaseService.prototype.method;
//BaseService.prototype.config;

/**
 *
 */
BaseService.prototype.loadConfigs = function () {
    if (!this.method) {
        throw new Error("Set method property first");
    }
    this.config = conf.get('services:' + this.method);
};

/**
 *
 * @param {object} result
 * @param {object} extra
 * @return {object}
 */
BaseService.prototype.formalize = function (result, extra) {
    return result;
};

/**
 *
 * @param {string} ip
 * @param {Function} callback
 */
BaseService.prototype.lookup = function (ip, callback) {
    //console.log(this.method);
    var options = util._extend({}, this.config.requestOptions);
    options.path = options.path.replace('{{ip}}', ip);
    options.timeout = 5000;
    var self = this;
    var start = new Date();
    var req = http.request(options, function (res) {
        self.requestTime = new Date() - start;
        var extra = {requestTime: self.requestTime};
        if (res.statusCode !== 200) {
            console.log("callback called - status");
            callback("status code " + res.statusCode, null);
            return;
        }
        res.setEncoding('utf8');
        var answer = '';
        res.on('data', function (chunk) {
            answer += chunk;
        }).on('end', function () {
            console.log("callback called - end"+self.method);
            callback(null, self.formalize(answer, extra));
        });
    }).on('error', function (err) {
        err.method = self.method;
        console.log("callback called - err"+self.method);
        callback(err, null);
    });

    req.end();
};


module.exports = BaseService;

