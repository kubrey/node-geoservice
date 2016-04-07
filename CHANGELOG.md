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
