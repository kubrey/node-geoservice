"use strict";

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {bool} isNumericSort true - sort object properties as numeric value, false - sort as string value.
 * @param {string} property sort according to the property value
 * @param {string} direction - direction of sorting(asc,desc)
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
function sortProperties(obj, isNumericSort, property, direction) {
    isNumericSort = isNumericSort || false; // by default text sort
    direction = direction || 'asc';
    var sortable = [];

    for (var key in obj) {
        //console.log(obj[key]);
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
        //sortable.push([key, obj[key]]);
    }


    if (isNumericSort) {
        sortable.sort(function (a, b) {
            if (direction === 'desc') {
                return b[1][property] - a[1][property];
            } else {
                return a[1][property] - b[1][property];
            }

        });
    }
    else {
        sortable.sort(function (a, b) {
            if (direction === 'desc') {
                var x = b[1][property].toLowerCase(),
                    y = a[1][property].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            } else {
                var x = a[1][property].toLowerCase(),
                    y = b[1][property].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            }
        });
    }
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

/**
 *
 * @param ip should be ipv4
 * @return {number}
 */
function ip2long(ip) {
    var ipl = 0;
    ip.split('.').forEach(function (octet) {
        ipl <<= 8;
        ipl += parseInt(octet);
    });
    return (ipl >>> 0);
}

/**
 *
 * @param {String} path
 * @return {Promise}
 */
function isFile(path) {
    return promisize(require('fs').stat, path);
}

/**
 *
 * @param {Function} fn
 * @param {Mixed} arg
 * @return {Promise}
 */
function promisize(fn, arg) {
    return new Promise(function (resolve, reject) {
        fn(arg, (err, result)=> {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    sort: sortProperties,
    ip2long: ip2long,
    isFile: isFile,
    promisize: promisize
};
