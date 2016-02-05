"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../configs"));

function BaseService() {
    BaseService.call(this);
};

BaseService.prototype.method;
BaseService.prototype.config;

/**
 *
 */
BaseService.prototype.loadConfigs = function () {
    if (!this.method) {
        throw new Error("Set method property first");
    }
    this.config = conf.get('services:' + method);
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
};

console.log(BaseService.prototype);

module.export = BaseService;

