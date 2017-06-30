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
            var loc = ipData.loc.split(",");

            var locData = {
                latitude: loc[0],
                longitude: loc[1],
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
            return callback("Unable to obtain your location via IP lookup or geolocation API", null);
        });
    }

    /**
     * This function gets the user's current location via the navigator
     * 
     * @param {function(err: string, data: object)} callback - a function to be invoked once the location has been established. 
     * @returns {void}
     */
    function _getLocation(callback) {
        if (!navigator.geolocation) {
            return _getLocationByIP(callback);
        }

        navigator.geolocation.getCurrentPosition(function (loc) {
            var locData = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            };

            return callback(null, locData);
        }, function () {
            return _getLocationByIP(callback);
        });
    }

    exports.getLocation = function (callback) {
        return _getLocation(callback);
    };
});