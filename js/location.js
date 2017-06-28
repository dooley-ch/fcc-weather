define(function (require, exports, module) {
    //jshint unused:false
    'use strict';

    function _currentLocation() {
        var loc = {
            latitude: 0,
            longitude: 0,
            city: "",
            country: "",
            countryCode: "",
            zip: "" 
        };

        return loc;
    }

    function _getLocation() {
        return _CurrentLocation();
    }

    exports.getLocation = function () {
        return _getLocation();
    };
});