var geo = require('./lib/geosearch');
var options = {
    services: {
        'maxmind-dat': false,
        ipinfo: false,
        'ip-api': false,
        geobytes: false,
        ipgeobase:false,
        //freegeoip: false,
        'maxmind-mmdb': 1
    }
};
geo.setOptions(options);
geo.lookup('8.8.8.8', function (err, res) {
    console.log(err, res);
});
