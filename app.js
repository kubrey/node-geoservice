"use strict";

var path = require('path');
var conf = require('./configs');
var helper = require('./helpers');
var async = require('async');
var util = require('util');

var services = conf.get('services');

for (var iter in services) {
    //console.log(iter);
    if (services[iter].active !== true) {
        delete services[iter];
    }
}

var sorted = helper.sort(services, true, 'priority', 'asc');
//console.log(sorted);

var ip = process.argv[2] || '18.101.101.101';

var queue = async.priorityQueue(function (task, callback) {
    console.log('start ' + task.title + ";" + queue.running());
    //console.log(util.inspect(task.callback.toString()));
    callback(task.ip, task.callback);
}, 2);

for (var service in sorted) {
    var fn = require(path.join(__dirname, "services/" + sorted[service][0]));
    var cb = function (err, result) {
        console.log(err);
        if (!err) {
            console.log('finished and killed; ' + queue.running());
            queue.kill();
            console.log('is idle; ' + queue.idle());
        }
        console.log(result);
    };
    queue.push({
        title: sorted[service][0],
        ip: ip,
        callback: cb
    }, sorted[service][1].priority, fn.lookup);
}


//console.log(activeServices);