# v0.2.7

 - Setting default encoding to reading stream of `ipgeobase`

# v0.2.6

- Updating readme

# v0.2.5

- Disabling `freegeoip` by default


# v0.2.4

- Setting default `maxmind-dat` and `maxmind-mmdb` paths to required modules' internal path (#7)


# v0.2.3

- Handling `maxmind-dat` exceptions on valid directory path but not containing *.dat files (#5)

Bugs fixed:
- Correct setup of `maxmind-dat` options


# v0.2.2

- Handling `maxmind-mmdb`  exceptions on ip like `::ffff:8.8.8.8`
- Setting previous `nconf` source path while getting value from config


# v0.2.1

Bug fixed:
- `Nconf.get` method is encapsulated to the `nconf.getVal` in order to prevent overwriting `nconf` source(#4)


# v0.2.0

- Allowing value of `service.active` as not boolean (#3)
- Enabling `maxmind-mmdb` by default, priority = 30

Bug fixed:
- Updating `maxmind-mmdb` result parsing seting correct city and countryName/countryCode data;


# v0.1.13

- IPv6 is allowed for lookup. Currently supporting methods are `maxmind`(both) and `ipapi` (#2)


# v0.1.12

- Examples added in `examples` folder
  To run: `node examples/allrequired.js 8.8.8.8`


# v0.1.11

- Services timeout is set to 3000 ms and moved to config

Bug Fixed:
- Checking required fields if set(#1)


# v0.1.10

- `req.setTimeout` is set to `ip-api` method
- Debug Project name is set to GeoSearch; for using debug mode: `DEBUG=GeoSearch:*`


# v0.1.9

- `Ipgeobase` default path is fixed and set to relative
- Online services lookup method is updated with req.setTimeout to prevent waiting long time for a response if service is down
- Required paths in test\services are fixed
