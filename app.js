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

/**
 *
 * @constructor
 */
function GeoLocator() {
    //this.options;
    //this.optionsError;
    //
    //this.commonOptions;
    //this.services;
}

/**
 * Initialization
 * @param options
 */
GeoLocator.init = function (options) {
    this.options = options;
    this.optionsError = null;
    //console.log(conf.get(),"2132432");

    this.commonOptions = JSON.parse(JSON.stringify(setCommonOptions));
    this.services = JSON.parse(JSON.stringify(setServices));
};

/**
 *
 * @param Object options
 * @return {GeoLocator}
 */
GeoLocator.setOptions = function (options) {
    this.init(options);
    if (options !== undefined) {
        if (options.services !== undefined && Object.keys(options.services).length) {
            for (var iter in options.services) {
                if (this.services[iter] !== undefined) {
                    this.services[iter]['active'] = options.services[iter];
                }
            }
        }
        if (options.common !== undefined && Object.keys(options.common).length) {
            for (var it in options.common) {
                this.commonOptions[it] = options.common[it];
            }
            if (options.common.checkField !== undefined) {
                if (Object.keys(setFields).indexOf(options.common.checkField) === -1) {
                    this.optionsError = 'Rechecking field in common option is invalid(' + options.common.checkField + ').\n Must be one of these: ' + Object.keys(setFields).join(',');
                    //throw new Error('Rechecking field in common option is invalid(' + options.common.checkField + '). Must be one of these: ' + Object.keys(setFields).join(','));
                }
            }
            if (options.common.checkLevel !== undefined) {
                if (parseInt(options.common.checkLevel) < 1 || isNaN(options.common.checkLevel)) {
                    this.commonOptions.checkLevel = 1;
                }
            }
        }
    }

    return this;
};

/**
 *
 * @param ip
 * @param callback
 */
GeoLocator.lookup = function (ip, callback) {
    if (this.optionsError !== null && this.optionsError !== undefined) {
        callback(this.optionsError, null);
    }


    if (this.options === undefined) {
        this.init({});
    }

    var self = this;
    var options = this.options;
    var accumulatedResult = [], isDone = false;
    var sorted;
    var setupFields = JSON.parse(JSON.stringify(setFields));

    console.log("----------start--------", ip, isDone, "---------------------");

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
        //commonOptions.checkField value should be the same in {{commonOptions.checkLevel}} number of services
        //e.g commonOptions.checkLevel:2,commonOptions.checkField:countryCode ->
        //then ipinfo countryCode=US && ip-api countryCode=US ->
        //then returning true;
        if (self.commonOptions.checkLevel > 1) {
            var checkCounter = [];
            var fieldValues = {};
            for (var serv in accumulatedResult) {
                for (var dataField in accumulatedResult[serv]) {
                    if (dataField === self.commonOptions.checkField) {
                        checkCounter.push(accumulatedResult[serv][dataField]);
                        if (fieldValues[accumulatedResult[serv][dataField]] === undefined) {
                            fieldValues[accumulatedResult[serv][dataField]] = 1;
                        } else {
                            fieldValues[accumulatedResult[serv][dataField]]++;
                        }
                    }

                    if (fieldValues[accumulatedResult[serv][dataField]] === self.commonOptions.checkLevel) {
                        return true;
                    }
                }
            }
            //var res = Object.keys(accumulatedResult).length === Object.keys(self.services).length ? true : false;
            //console.log(res);
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

        var methods = [];
        var requestTime = 0;

        for (var iterFirst in accumulatedResult) {
            methods[accumulatedResult[iterFirst].method] = accumulatedResult[iterFirst].requestTime;
            requestTime += accumulatedResult[iterFirst].requestTime;
        }


        for (var i in keys) {
            for (var it in accumulatedResult) {
                if (accumulatedResult[it][keys[i]] !== null) {
                    result[keys[i]] = accumulatedResult[it][keys[i]];
                }
                if (keys[i] === 'requestTime' && accumulatedResult[it][keys[i]]) {
                    result[keys[i]] += accumulatedResult[it][keys[i]];
                }
            }
        }

        result.requestTime = requestTime;

        result.usedMethods = methods;
        return result;
    }

    /**
     *
     * @param fields
     */
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

    if (options && Object.keys(options).length) {
        options.fields = options.fields || {};
        if (options.fields.length) {
            //preventing service fields to be updated outside of this particular ip-data search
            //var setupFields = util._extend({}, setupFields);
        }
        setSearchedFields(options.fields);
        if (options.services !== undefined && options.services.length) {
            //preventing services status to be updated outside of this particular ip-data search
            //var services = util._extend({}, services);
        }
        //options.services = options.services || {};
        //setSearchServices(options.services);
    } else {
        setSearchedFields({});
    }


    this.cleanServices();
    if (!Object.keys(this.services).length) {
        callback("No methods are allowed", null);
    }

    //var cbStack = 0;

    sorted = helper.sort(this.services, true, 'priority', 'asc');

    var queue = async.priorityQueue(function (task, callback) {
        console.log("run ", task.title);
        callback(task.ip, task.callback);
    }, 3);

    var tries = 0;
    var cbStack = Object.keys(sorted).length;
    //console.log(cbStack + " - all methods");
    for (var service in sorted) {
        //++cbStack;
        var servFile = path.join(__dirname, "services/" + sorted[service][0]);
        //console.log(servFile);
        var fn = require(servFile);
        var cb = function (err, result) {
            tries++;
            console.log('finished and killed; ' + queue.running(),queue.started);
            //console.log("tries: " + tries, result.method, "left " + cbStack);
            cbStack--;
            if (!err) {
                console.log(result.method + " found");
                if (cbStack < 0) {
                    //console.log("???????", result);
                }
                accumulatedResult.push(result);
                if (hasFoundRequested() && !isDone) {
                    isDone = true;
                    console.log('is idle; ' + queue.idle());
                    var res = handleAccumulated();
                    //queue.kill();
                    //queue.tasks = [];
                    callback(null, res);
                    //return;
                }else {
                    console.log('not completed');
                }
            } else {
                console.log("err",err);
            }
            if (cbStack <= 0 && !isDone) {
                console.log('nofound');
                //all services have already run but not all required fields found ->
                callback("Geo data was not found", null);
                //queue.kill();
                //queue.tasks = [];
            }

        };
        //console.log(sorted[service][1].priority);
        queue.push({
            title: sorted[service][0],
            ip: ip,
            callback: cb
        }, sorted[service][1].priority, fn.lookup);
    }

    queue.drain = function () {
        if (accumulatedResult && isDone) {
            queue.kill();
            queue.tasks = [];
        }
    };

    queue.empty = function(){
        console.log('all passed');
    }

};

/**
 *
 * @return {GeoLocator}
 */
GeoLocator.cleanServices = function () {
    for (var iter in this.services) {
        if (this.services[iter].active !== true) {
            delete this.services[iter];
        }
    }

    return this;
};


module.exports = GeoLocator;