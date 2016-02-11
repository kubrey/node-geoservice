"use strict";

var path = require('path');
var conf = require('./configs');
var helper = require('./helpers');
var async = require('async');
var util = require('util');
var net = require('net');
var setFields = conf.get('geoObject');
var setServices = conf.get('services');


function GeoLocator() {

}


GeoLocator.setOptions = function(options){
    this.options = options;
};

GeoLocator.lookup = function (ip, callback, options) {
    //console.log(services);

    options = this.options;
    var accumulatedResult = [], isDone = false;
    var sorted;
    var setupFields = util._extend({}, setFields);
    var services = util._extend({}, setServices);

    console.log(services['ip-api']);
    console.log(setServices['ip-api']);

    /**
     *
     * @return {boolean}
     */
    function hasFoundRequested() {
        var data = handleAccumulated();
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

    function setSearchServices(servs) {
        //console.log(servs);
        for (var iter in servs) {
            //console.log(services[iter],'---');
            if (servs[iter] === false) {
                services[iter].active = false;
            } else {
                services[iter].priority = parseInt(servs[iter]);
            }
        }
    }


    if (net.isIPv4(ip) === false) {
        callback(ip + " is not IPv4", null);
        return;
    }

    if (options) {
        options.fields = options.fields || {};
        if (options.fields.length) {
            //preventing service fields to be updated outside of this particular ip-data search
            //var setupFields = util._extend({}, setupFields);
        }
        setSearchedFields(options.fields);
        if (options.services.length) {
            //preventing services status to be updated outside of this particular ip-data search
            //var services = util._extend({}, services);
        }
        options.services = options.services || {};
        setSearchServices(options.services);
    }


    for (var iter in services) {
        if (services[iter].active !== true) {
            delete services[iter];
        }
    }

    var cbStack = 0;

    sorted = helper.sort(services, true, 'priority', 'asc');


    var queue = async.priorityQueue(function (task, callback) {
        //console.log('start ' + task.title + ";" + queue.running());
        //console.log(util.inspect(task.callback.toString()));
        callback(task.ip, task.callback);
    }, 1);

    for (var service in sorted) {
        ++cbStack;
        var fn = require(path.join(__dirname, "services/" + sorted[service][0]));
        var cb = function (err, result) {
            --cbStack;
            if (!err) {
                accumulatedResult.push(result);
                if (hasFoundRequested() && !isDone) {
                    isDone = true;
                    //console.log('finished and killed; ' + queue.running());
                    //
                    //console.log('is idle; ' + queue.idle());
                    var res = handleAccumulated();
                    queue.kill();
                    queue.tasks = [];
                    callback(null, res);
                    return;
                }
            }
            if (cbStack === 0 && !isDone) {
                //all services have already run but not all required fields found ->
                callback("Geo data was not found", null);
            }
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

};



module.exports = GeoLocator;