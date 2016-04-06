"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../configs"));
var http = require('http');
var util = require('util');
var debug = require('debug')(conf.get('projectName') + ":service");

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
    //console.log(this.method + " running");
    var options = util._extend({}, this.config.requestOptions);
    options.path = options.path.replace('{{ip}}', ip);
    options.timeout = 5000;
    var self = this;
    var start = new Date();
    var req = http.request(options, function (res) {
        self.requestTime = new Date() - start;
        var extra = {requestTime: self.requestTime};
        if (res.statusCode !== 200) {
            debug("callback called - status");
            callback("status code " + res.statusCode, null);
            return;
        }
        res.setEncoding('utf8');
        var answer = '';
        res.on('data', function (chunk) {
            answer += chunk;
        }).on('end', function () {
            if (!answer) {
                callback("Empty response", null);
                return;
            }
            debug("callback called - end" + self.method);

            var resultObj = self.formalize(answer, extra);
            var isOk = false;
            for (var key in resultObj) {
                if (resultObj[key] !== null && (key != 'method' && key != 'requestTime')) {
                    isOk = true;
                    break;
                }
            }
            if (!isOk) {
                callback("Empty response", null);
            } else {
                callback(null, resultObj);
            }
        });
    }).on('error', function (err) {
        err.method = self.method;
        debug("callback called - err" + self.method);
        callback(err, null);
    });

    req.end();
};


module.exports = BaseService;

