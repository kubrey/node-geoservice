Geolocator is a library covering multiple free geoservices
==========================================================

Including:
 - Maxmind (v1), .dat files
 - Maxmind (v2), .mmdb files
 - Ipgeobase
 - Ip-api.com
 - Ipinfo.io
 - Freegeoip.net
 - Geobytes.com

 ### Usage

 ```
  var geo = require("geolocator");
  geo.lookup('8.8.8.8', function (err, result) {
      console.log(err,result);
   });
  ```

  `result` is an object containing these properties:
  - city
  - countryCode
  - countryName
  - latitude
  - longitude
  - isp
  - zip
  - regionName
  - regionCode

  ### Configuration

  Geolocator has flexible configuration options.

  By default only `countryCode` property is required. To set required fields

  ```
  var options = {};
  options.fields = [];
  options.fields.city = true;
  geo.setOptions(options);
   ```

   Also you can manage services. To disable services:

   ```
   options.services = {};
   options.services['ip-api'] = false;
   options.services['maxmind-mmdb'] = false;
   ```

   You can tell geolocator to doublecheck found result by necessary field:

   ```
   options.common = {};
   options.common.checkField = 'countryCode';
   options.common.checkLevel = 2;
   ```

   `options.common.checkLevel` contains number of services which should return equal value of `options.common.checkField`
