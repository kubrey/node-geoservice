"use strict";

var path = require('path');
var conf = require('./configs');
var helper = require('./helpers');
var async = require('async');
var util = require('util');
var net = require('net');

var services = conf.get('services');
var accumulatedResult = [], isDone = false;
var setupFields = conf.get('geoObject');
console.log(setupFields);

/**
 *
 * @param data
 * @return {boolean}
 */
function hasFoundRequested(data) {
    for (var it in setupFields) {
        if (setupFields[it] === true && data[it] === null) {
            return false;
        }
    }
    return true;
}

/**
 *
 * @return {{}}
 */
function handleAccumulated() {
    var result = {};
    var keys = Object.keys(accumulatedResult[0]);
    for (var i in keys) {
        result[keys[i]] = null;
    }

    for (var i in keys) {
        for (var it in accumulatedResult) {
            if (accumulatedResult[it][keys[i]] !== null) {
                result[keys[i]] = accumulatedResult[it][keys[i]];
            }
        }
    }
    return result;
}

function setSearchedFields(fields) {
    for (var iter in fields) {
        if (setupFields[iter]) {
            setupFields[iter] = fields[iter];
        }
    }
}

/**
 *
 * @param ip
 * @param callback
 * @param options
 */
function lookup(ip, callback, options) {
    if (net.isIPv4(ip) === false) {
        callback(ip + " is not IPv4", null);
        return;
    }
    for (var iter in services) {
        if (services[iter].active !== true) {
            delete services[iter];
        }
    }

    if (options) {
        options.fields = options.fields || {};
        setSearchedFields(options.fields);
    }

    var sorted = helper.sort(services, true, 'priority', 'asc');

    ip = ip || '18.101.101.101';

    var queue = async.priorityQueue(function (task, callback) {
        //console.log('start ' + task.title + ";" + queue.running());
        //console.log(util.inspect(task.callback.toString()));
        callback(task.ip, task.callback);
    }, 1);

    for (var service in sorted) {
        var fn = require(path.join(__dirname, "services/" + sorted[service][0]));
        var cb = function (err, result) {
            //console.log(err);
            if (!err) {
                accumulatedResult.push(result);
                if (hasFoundRequested(result) && !isDone) {
                    isDone = true;
                    //console.log('finished and killed; ' + queue.running());
                    //
                    //console.log('is idle; ' + queue.idle());
                    var res = handleAccumulated();
                    queue.kill();
                    queue.tasks = [];

                    callback(null, res);
                }
            }
            //console.log(result);
        };
        queue.push({
            title: sorted[service][0],
            ip: ip,
            callback: cb
        }, sorted[service][1].priority, fn.lookup);
    }

    queue.drain = function () {
        if (accumulatedResult) {
            queue.kill();
            queue.tasks = [];
        }
    };
}


module.exports = {
    lookup: lookup
};