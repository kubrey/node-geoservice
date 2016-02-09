"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../configs"));
const http = require('http');

function BaseService() {
    this.method;
    this.config;
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
 * @return {object}
 */
BaseService.prototype.formalize = function (result) {
    return result;
};

/**
 *
 * @param {string} ip
 * @param {Function} callback
 */
BaseService.prototype.lookup = function (ip, callback) {
    this.config.requestOptions.path = this.config.requestOptions.path.replace('{{ip}}', ip);
    var options = this.config.requestOptions;
    var self = this;
    var req = http.request(options, function (res) {
        if (res.statusCode !== 200) {
            callback("status code " + res.statusCode, null);
            return;
        }
        res.setEncoding('utf8');
        var answer = '';
        res.on('data', function (chunk) {
            answer += chunk;
        }).on('end', function () {
            callback(null, self.formalize(answer));
            //res.end();
        });
    }).on('error', function (err) {
        console.log(err);
        callback(err, null);
    }).setTimeout(5000, function () {
        req.abort();
        callback("Timeout", null);
    });

    req.end();
};


module.exports = BaseService;

