Geosearch is a library covering multiple free geoservices and modules
==========================================================

Including:
 - Maxmind (v1) `maxmind-dat`
 - Maxmind (v2) `maxmind-mmdb`
 - Ipgeobase `ipgeobase` has city, regions and coordinates for Russia and Ukraine only
 - Ip-api.com `ip-api`
 - Ipinfo.io `ipinfo`
 - Freegeoip.net `freegeoip`
 - Geobytes.com `geobytes`

 This module is useful when you need to detect location by ip address with high accuracy.
 If you have ip addresses mainly from Russia and Ukraine - good options is to set `Ipgeobase` as first priority.


 ### Installation

 `npm i geosearch`


 ### Usage

 ```
  var geo = require("geosearch");
  geo.lookup('8.8.8.8', function (err, result) {
      console.log(err,result);
   });
  ```

  `result` is an object containing these geo-properties:
  - city
  - countryCode
  - countryName
  - latitude
  - longitude
  - isp
  - zip
  - regionName
  - regionCode

  And also some technical properties:
  - method (last used method)
  - usedMethods (methods used to find requested data and search time fot each of them)
  - requestTime (whole search time, ms)

  Answer example:

  ![Answer example](http://storage6.static.itmages.com/i/16/0407/h_1460030897_8656083_bfc7d8c1c6.jpeg)

  ### Configuration

  GeoSearch has flexible configuration options.

  By default only `countryCode` property is required. To set `city` as required field:

  ```
  var options = {};
  options.fields = {};
  options.fields.city = true;
  geo.setOptions(options);
   ```

   If first completed method's result does not contain all required fields,the resulting object will accumulate all found fields from methods
    until all required data will have been gathered.


   Also you can manage services. This example disables `ip-api` service and set `ipinfo` priority level to 10(less level value - higher priority)

   ```
   options.services = {};
   options.services['ip-api'] = false;
   options.services['ipinfo'] = 10;
   ```

   Methods with local geo-databases are the fastest, so they have better priority by default.
   Also keep in mind that some online services have limitations for amount of requests ion a period of time.
   `ipinfo` has daily limit - 1000 requests;
   `geobytes` - 16000 requests per hour;
   So it may not be the best option to set `ipinfo` top priority if you have thousands of daily ip look-ups

   You can tell GeoSearch to double check found result by one field:

   ```
   options.common = {};
   options.common.checkField = 'countryCode';
   options.common.checkLevel = 2;
   ```

   `options.common.checkLevel` contains number of services which should return equal value of `options.common.checkField`.
   In this example callback with result will be executed only after at least two methods return same `countryCode`.

   Methods `maxmind-dat`, `maxmind-mmdb` and `ipgeobase` use local files to get information by ip. Other methods use online services.

   To specify path to these files you have to use the following code

   ```
   options.files = {};
   options.files['maxmind-mmdb'] = '/path/to/db/file.mmdb';
   options.files['maxmind-dat']['directory'] = '/path/to/directory/containing/dat-files/';
   ```

   Files for `ipgeobase` are already in package. If you want to use your own files(maybe newer):

   ```
   options.files['ipgeobase']['cidrdb'] = '/path/to/countries-db-file/cidr.txt';
   options.files['ipgeobase']['citiesdb'] = '/path/to/cities-db-file/citiesdb.txt';
   ```

   To reset options:

   ```
   geo.resetOptions();
   ```

   Reset can be useful if you want to run several `geo.lookup`  with different options.

   ### Run Tests

   Tests are written in `mocha` and `chai`

   ```
   $ npm test
   ```

   ### Other realizations

   [PHP version](https://github.com/kubrey/geoservice)
