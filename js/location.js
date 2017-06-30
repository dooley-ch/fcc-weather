define(function (require, exports) {
    "use strict";
    
    function _getLocation(callback) {
        var loc = {
            latitude: 0,
            longitude: 0,
            city: "",
            country: "",
            countryCode: "",
            zip: "" 
        };

        return callback(null, loc);
    }

    exports.getLocation = function (callback) {
        return _getLocation(callback);
    };
});