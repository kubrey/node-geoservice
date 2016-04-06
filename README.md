Geolocator is a library covering multiple free geoservices and modules
==========================================================

Including:
 - Maxmind (v1) `maxmind-dat`
 - Maxmind (v2) `maxmind-mmdb`
 - Ipgeobase `ipgeobase` has city, regions and coordinates for Russia and Ukraine only
 - Ip-api.com `ip-api`
 - Ipinfo.io `ipinfo`
 - Freegeoip.net `freegeoip`
 - Geobytes.com `geobytes`

 ### Usage

 ```
  var geo = require("geolocator");
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

  ### Configuration

  Geolocator has flexible configuration options.

  By default only `countryCode` property is required. To set required fields

  ```
  var options = {};
  options.fields = {};
  options.fields.city = true;
  geo.setOptions(options);
   ```

   Also you can manage services. This example disables `ip-api` service and set `ipinfo` priority level to 10(less level value - higher priority)

   ```
   options.services = {};
   options.services['ip-api'] = false;
   options.services['ipinfo'] = 10;
   ```

   You can tell geolocator to doublecheck found result by one field:

   ```
   options.common = {};
   options.common.checkField = 'countryCode';
   options.common.checkLevel = 2;
   ```

   `options.common.checkLevel` contains number of services which should return equal value of `options.common.checkField`

   Methods `maxmind-dat`, `maxmind-mmdb` and `ipgeobase` use local files to get information by ip. Other methods use online services.

   To specify path to these files you have to use the following code

   ```
   options.files = {};
   options.files['maxmind-mmdb'] = '/path/to/db/file.mmdb';
   options.files['maxmind-dat']['directory'] = '/path/to/directory/containing/dat-files/';
   ```

   Files for ipgeobase are already in package. If you want to use your own files(maybe newer):

   ```
   options.files['ipgeobase']['cidrdb'] = '/path/to/countries-db-file/cidr.txt';
   options.files['ipgeobase']['citiesdb'] = '/path/to/cities-db-file/citiesdb.txt';
   ```
