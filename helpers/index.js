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

module.exports = {
    sort: sortProperties
};
