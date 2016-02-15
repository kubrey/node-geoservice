"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../configs"));
const http = require('http');
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
    var options = util._extend({}, this.config.requestOptions);
    options.path = options.path.replace('{{ip}}', ip);
    var self = this;
    var start = new Date();
    var req = http.request(options, function (res) {
        self.requestTime = new Date() - start;
        var extra = {requestTime: self.requestTime}
        if (res.statusCode !== 200) {
            callback("status code " + res.statusCode, null);
            return;
        }
        res.setEncoding('utf8');
        var answer = '';
        res.on('data', function (chunk) {
            answer += chunk;
        }).on('end', function () {
            callback(null, self.formalize(answer, extra));
            //res.end();
        });
    }).on('error', function (err) {
        callback(err, null);
    }).setTimeout(5000, function () {
        req.abort();
        callback("Timeout", null);
    });

    req.end();
};


module.exports = BaseService;

