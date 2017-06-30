define(function (require, exports) {
    "use strict";
    
    var $ = require("jquery");

    /**
     * This function gets the user's current location by using their IP address
     * 
     * @param {function(err: string, data: object)} callback - a function to be invoked once the location has been established. 
     * @returns {void}
     */
    function _getLocationByIP(callback) {
        $.getJSON("https://ipinfo.io/json").done(function (ipData) {            
            var locData = {
                location: ipData.city + ", " + ipData.country,
                zip: ipData.postal,
                countryCode: ipData.country.toLowerCase()
            };

            $.getJSON("data/country_names.json").done(function (countryData) {
                var countryName = countryData[ipData.country];

                locData.location = ipData.city + ", " + countryName;

                return callback(null, locData);
            }).fail(function () {
                return callback(null, locData);
            });
        }).fail(function () {
            return callback("Unable to obtain your location", null);
        });
    }

    /**
     * This function gets the user's current location via the navigator
     * 
     * @param {function(err: string, data: object)} callback - a function to be invoked once the location has been established. 
     * @returns {void}
     */
    function _getLocation(callback) {
        var geocoder = new google.maps.Geocoder();

        if (!navigator.geolocation) {
            return _getLocationByIP(callback);
        }

        navigator.geolocation.getCurrentPosition(function (loc) {
            var latlng = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);

            geocoder.geocode({"latLng": latlng}, function(results, status) {
                if (status != google.maps.GeocoderStatus.OK) {
                    return _getLocationByIP(callback);
                }

                var data = results[0].address_components;

                var locData = {
                    location: data[2].long_name + ", " + data[5].long_name,
                    zip: data[6].long_name,
                    countryCode: data[5].short_name.toLowerCase()
                };

                return callback(null, locData); 
            });

        }, function () {
            return _getLocationByIP(callback);
        });
    }

    exports.getLocation = function (callback) {
        return _getLocation(callback);
    };
});