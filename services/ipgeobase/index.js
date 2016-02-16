"use strict";

var path = require("path");
var conf = require(path.join(__dirname, "../../configs"));
var cird = conf.get('services:' + path.basename(path.dirname(__filename)) + ":cidrdb");
var cities = conf.get('services:' + path.basename(path.dirname(__filename)) + ":citiesdb");

var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');

var instream = fs.createReadStream(cird);
var outstream = new stream;
outstream.readable = true;
outstream.writable = true;

var rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
});

rl.on('line', function(line) {
    //console.log(line);
    var lineRow = line.split("\t");
    var range = lineRow[2];
    console.log(lineRow);
    //Do your stuff ...
    //Then write to outstream
    //rl.write(cubestuff);
});


module.exports = {
    lookup: function (ip, callback) {

    }
};