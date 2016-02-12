"use strict";

var path = require('path');
var conf = require('./configs');
var helper = require('./helpers');
var async = require('async');
var util = require('util');
var net = require('net');
var setFields = conf.get('geoObject');
var setServices = conf.get('services');
var setCommonOptions = conf.get('commonOptions');

function GeoLocator() {

}

/**
 *
 * @param Object options
 * @return {GeoLocator}
 */
GeoLocator.setOptions = function (options) {
    this.options = options;
    this.commonOptions = JSON.parse(JSON.stringify(setCommonOptions));
    this.services = JSON.parse(JSON.stringify(setServices));

    if (options !== undefined) {
        if (options.services !== undefined && Object.keys(options.services).length) {
            for (var iter in options.services) {
                this.services[iter]['active'] = options.services[iter];
            }
        }
        if (options.common !== undefined && Object.keys(options.common).length) {
            for (var it in options.common) {
                this.commonOptions[it] = options.common[it];
            }
        }
    }

    return this;
};

GeoLocator.lookup = function (ip, callback) {
    var self = this;
    var options = this.options;
    var accumulatedResult = [], isDone = false;
    var sorted;
    var setupFields = JSON.parse(JSON.stringify(setFields));

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
        //If  commonOptions.checkLevel>1
        //commonOptions.checkField value should be the same in {{commonOptions.checkLevel}} services
        //e.g commonOptions.checkLevel:2,commonOptions.checkField:countryCode ->
        //then ipinfo countryCode=US && ip-api countryCode=US ->
        //then returning true;
        if (self.commonOptions.checkLevel > 1) {
            var checkCounter = [];
            var fieldValues = {};
            for (var serv in accumulatedResult) {
                for (var dataField in accumulatedResult[serv]) {
                    if(dataField === self.commonOptions.checkField){
                        checkCounter.push(accumulatedResult[serv][dataField]);
                    }

                    if (fieldValues[accumulatedResult[serv][dataField]] === self.commonOptions.checkLevel) {
                        console.log("------", checkCounter, "---------");
                        console.log("DONE=============",fieldValues[accumulatedResult[serv][dataField]]);
                        return true;
                    }
                }
            }
            console.log("------", checkCounter, "---------");
            return Object.keys(accumulatedResult).length === Object.keys(self.services).length ? true : false;
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
        //options.services = options.services || {};
        //setSearchServices(options.services);
    }


    this.cleanServices();

    var cbStack = 0;

    sorted = helper.sort(this.services, true, 'priority', 'asc');

    var queue = async.priorityQueue(function (task, callback) {
        console.log('start ' + task.title + ";" + queue.running());
        //console.log(util.inspect(task.callback.toString()));
        callback(task.ip, task.callback);
    }, 1);
    //console.log(sorted);

    for (var service in sorted) {
        ++cbStack;
        var fn = require(path.join(__dirname, "services/" + sorted[service][0]));
        var cb = function (err, result) {
            --cbStack;
            if (!err) {
                result.method = sorted[service][0];
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


GeoLocator.cleanServices = function () {
    for (var iter in this.services) {
        if (this.services[iter].active !== true) {
            delete this.services[iter];
        }
    }

    return this;
};

module.exports = GeoLocator;